import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const foodModel = {
  async createFood(restaurantId, food) {
    const { name, price, description } = food;
    const foodId = nanoidNumbersOnly();
    await pool.query(`INSERT INTO foods (food_id ,name, price, description, restaurant_id) VALUES (?, ?, ?, ?, ?)`, [
      foodId,
      name,
      price,
      description,
      restaurantId,
    ]);

    return foodId;
  },

  async updateFood(restaurantId, foodId, food) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(food)) {
      if (value !== undefined && value !== null) {
        values.push(value);
        fields.push(`${key} = ?`);
      }
    }
    if (fields.length === 0) return false;
    values.push(restaurantId, foodId);
    const sql = `UPDATE foods SET ${fields.join(", ")} WHERE restaurant_id = ? AND food_id = ?`;
    const [result] = await pool.query(sql, values);
    return result.affectedRows > 0;
  },

  async getAllFood(latitude, longitude, radius = 10000) {
    const query = `SELECT 
    r.name AS restaurant_name,
    r.logo_url AS restaurant_logo,
    r.restaurant_id,
    a.address_line1, 
    a.address_line2, 
    a.longitude, 
    a.latitude,
    (
        6371000 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(a.latitude)) * 
            COS(RADIANS(a.longitude) - RADIANS(?)) + 
            SIN(RADIANS(?)) * SIN(RADIANS(a.latitude))
        )
    ) AS estimated_distance,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'food_id', f.food_id,
            'name', f.name,
            'price', f.price,
            'description', f.description,
            'image_url', f.image_url,
            'total_reviews', COALESCE(fr.total_reviews, 0),
            'average_rating', COALESCE(fr.average_rating, 0)
        )
    ) AS foods
FROM foods f 
JOIN restaurants r ON f.restaurant_id = r.restaurant_id 
JOIN addresses a ON a.address_id = r.address_id
LEFT JOIN (
    SELECT 
        food_id,
        COUNT(review_id) AS total_reviews,
        ROUND(AVG(rating), 1) AS average_rating
    FROM reviews
    GROUP BY food_id
) fr ON fr.food_id = f.food_id
GROUP BY r.restaurant_id, a.address_id
HAVING estimated_distance <= ?
ORDER BY estimated_distance ASC
LIMIT 20;
`;

    const [foods] = await pool.query(query, [latitude, longitude, latitude, radius]);
    return foods;
  },
};

export default foodModel;

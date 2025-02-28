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

  async getPopularFoods(latitude, longitude, radius = 10000, limit = 20, offset = 0) {
    const query = `
 SELECT 
    r.restaurant_id,
    r.name AS restaurant_name,
    r.logo_url AS restaurant_logo,
    a.address_line1,
    a.address_line2,
    a.latitude,
    a.longitude,
    f.food_id, 
    f.image_url as food_image,
    f.name as food_name,
    f.description as food_description,
    f.price,
    COALESCE(COUNT(b.bill_id), 0) AS total_orders,
    (
        6371000 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(a.latitude)) * 
            COS(RADIANS(a.longitude) - RADIANS(?)) + 
            SIN(RADIANS(?)) * SIN(RADIANS(a.latitude))
        )
    ) AS estimated_distance,
    COALESCE(SUM(bi.quantity), 0) AS total_orders,
    COALESCE(COUNT(br.review_id), 0) AS total_reviews,
    COALESCE(ROUND(AVG(br.rating), 1), 0) AS average_rating
FROM foods f
LEFT JOIN bill_items bi ON bi.food_id = f.food_id
LEFT JOIN bills b ON b.bill_id = bi.bill_id AND b.order_status = 'completed'
LEFT JOIN reviews br ON br.bill_id = b.bill_id
JOIN restaurants r ON r.restaurant_id = f.restaurant_id
JOIN addresses a ON a.address_id = r.address_id
GROUP BY f.food_id
HAVING estimated_distance <= ?
ORDER BY total_orders DESC, total_reviews DESC, average_rating DESC, estimated_distance ASC
LIMIT ? OFFSET ?;
`;
    // console.log("latitude", latitude, "longitude", longitude, "radius", radius, "limit", limit, "offset", offset);
    const [foods] = await pool.query(query, [latitude, longitude, latitude, radius, limit, offset]);

    return foods;
  },

  async getFoodNearby(latitude, longitude, radius = 10000, limit = 20, offset = 0) {
    const query = `SELECT 
    r.restaurant_id,
    r.name AS restaurant_name,
    r.logo_url AS restaurant_logo,
    r.cover_url AS restaurant_cover,
    r.description AS restaurant_description,
    a.address_line1, 
    a.address_line2, 
    a.latitude,
    a.longitude,
    f.food_id, 
    f.image_url as food_image,
    f.name as food_name,
    f.description as food_description,
    f.price,
    (
        6371000 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(a.latitude)) * 
            COS(RADIANS(a.longitude) - RADIANS(?)) + 
            SIN(RADIANS(?)) * SIN(RADIANS(a.latitude))
        )
    ) AS estimated_distance
FROM foods f 
JOIN restaurants r ON r.restaurant_id = f.restaurant_id
JOIN addresses a ON a.address_id = r.address_id
GROUP BY f.food_id
HAVING estimated_distance <= ?
ORDER BY estimated_distance ASC
LIMIT ? OFFSET ?;
`;
    const [foods] = await pool.query(query, [latitude, longitude, latitude, radius, limit, offset]);
    return foods;
  },
};

export default foodModel;

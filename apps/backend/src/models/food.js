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
};

export default foodModel;

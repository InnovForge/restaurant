import { pool } from "../configs/mysql.js";

const restaurantModel = {
  async updateRestaurant(userId, userData) {
    const { name, email, password } = userData;
    const [result] = await pool.query("UPDATE restaurants SET name = ?, email = ?, password = ? WHERE id = ?", [
      name,
      email,
      password,
      userId,
    ]);
    return result.affectedRows > 0;
  },
};
export default restaurantModel;

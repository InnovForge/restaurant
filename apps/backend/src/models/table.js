import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const tableModel = {
  async createTable(restaurantId, tableData) {
    const tableId = nanoidNumbersOnly(16);
    const { tableName, seatCount } = tableData;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query("INSERT INTO tables (table_id, restaurant_id, tableName,seatCount) VALUES (?, ?, ?,?)", [
        tableId,
        restaurantId,
        tableName,
        seatCount,
      ]);

      await connection.commit();
      return { success: true, tableId };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating table:", error);
      return { success: false, message: error.message };
    } finally {
      connection.release();
    }
  },
};

export default tableModel;

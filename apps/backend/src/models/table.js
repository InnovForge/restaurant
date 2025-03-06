import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const tableModel = {
  async createTables(restaurantId, tableData) {
    const table_id = nanoidNumbersOnly(16);
    const { tableName: table_name, seatCount: seat_count } = tableData;

    await pool.query("INSERT INTO tables (table_id, restaurant_id, table_name,seat_count) VALUES (?, ?, ?,?)", [
      table_id,
      restaurantId,
      table_name,
      seat_count,
    ]);

    return table_id;
  },
  async getTables(restaurantId) {
    const [tables] = await pool.query("SELECT * FROM tables WHERE restaurant_id = ?", [restaurantId]);
    return tables;
  },
};

export default tableModel;

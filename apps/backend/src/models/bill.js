import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const billModel = {
  async createBill(billData) {
    const billId = nanoidNumbersOnly(16);
    const { restaurant_id, user_id, order_status } = billData;

    try {
      const sql = `
        INSERT INTO bills (bill_id, restaurant_id, user_id, order_status)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await pool.execute(sql, [billId, restaurant_id, user_id, order_status]);

      if (result.affectedRows === 1) {
        return { success: true, billId };
      }
      return { success: false, message: "Failed to create bill" };
    } catch (error) {
      console.error("Error creating bill:", error);
      return { success: false, message: error.message };
    }
  },
};

export default billModel;

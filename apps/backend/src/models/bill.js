import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const billModel = {
  async createBill(billData) {
    const billId = nanoidNumbersOnly(16);
    const billItemId = nanoidNumbersOnly(16);
    const { restaurant_id, user_id, order_status, food_id, reservation_id, quantity } = billData;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query("INSERT INTO bills (bill_id, restaurant_id, user_id, order_status) VALUES (?, ?, ?, ?)", [
        billId,
        restaurant_id,
        user_id,
        order_status,
      ]);

      await connection.query(
        "INSERT INTO bill_items (bill_item_id, bill_id, food_id, reservation_id, quantity) VALUES (?, ?, ?, ?, ?)",
        [billItemId, billId, food_id, reservation_id, quantity],
      );

      await connection.commit();
      return { success: true, billId, billItemId };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating bill:", error);
      return { success: false, message: error.message };
    } finally {
      connection.release();
    }
  },
};

export default billModel;

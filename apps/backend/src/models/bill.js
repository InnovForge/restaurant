import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const billModel = {
  async createBill(billData) {
    const billId = nanoidNumbersOnly(16); // Tạo ID duy nhất cho hóa đơn
    const {
      restaurant_id,
      user_id,
      order_status,
      reservation_id,
      payment_method,
      payment_status,
      items, // Danh sách các món ăn trong hóa đơn
    } = billData;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Thêm hóa đơn vào bảng `bills`
      await connection.query(
        `INSERT INTO bills (bill_id, restaurant_id, user_id, order_status, reservation_id, payment_method, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [billId, restaurant_id, user_id, order_status, reservation_id, payment_method, payment_status],
      );

      // Thêm các mục hóa đơn vào bảng `bill_items`
      for (const item of items) {
        const billItemId = nanoidNumbersOnly(16); // Tạo ID duy nhất cho mỗi mục hóa đơn
        await connection.query(
          `INSERT INTO bill_items (bill_item_id, bill_id, food_id, price_at_purchase, name_at_purchase, quantity)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [billItemId, billId, item.food_id, item.price_at_purchase, item.name_at_purchase, item.quantity],
        );
      }

      await connection.commit();
      return { success: true, billId };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating bill:", error);
      return { success: false, message: error.message };
    } finally {
      connection.release();
    }
  },
  async loadBill(billId) {
    const connection = await pool.getConnection();
    try {
      // Lấy thông tin hóa đơn từ bảng `bills`
      const [bill] = await connection.query(
        `SELECT b.bill_id, b.restaurant_id, b.user_id, b.order_status, b.reservation_id, b.payment_method, b.payment_status, b.created_at
           FROM bills b
           WHERE b.bill_id = ?`,
        [billId],
      );

      if (bill.length === 0) {
        return { success: false, message: "Bill not found" };
      }

      return { success: true, bill: bill[0] };
    } catch (error) {
      console.error("Error loading bill:", error);
      return { success: false, message: error.message };
    } finally {
      connection.release();
    }
  },

  async loadBillItem(billId) {
    const connection = await pool.getConnection();
    try {
      // Lấy danh sách các mục hóa đơn từ bảng `bill_items`
      const [billItems] = await connection.query(
        `SELECT bi.bill_item_id, bi.food_id, bi.price_at_purchase, bi.name_at_purchase, bi.quantity
           FROM bill_items bi
           WHERE bi.bill_id = ?`,
        [billId],
      );

      return { success: true, billItems };
    } catch (error) {
      console.error("Error loading bill items:", error);
      return { success: false, message: error.message };
    } finally {
      connection.release();
    }
  },
};

export default billModel;

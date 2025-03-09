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
  async getBillById(billId) {
    const query = `SELECT 
    r.reservation_id, 
    r.restaurant_id, 
    r.user_id AS reservation_user_id, 
    r.table_id, 
    r.reservation_datetime, 
    r.check_in_time, 
    r.reservation_status, 
    r.created_at AS reservation_created_at, 
    r.updated_at AS reservation_updated_at, 
    tb.table_name,
    -- Trả về bill dưới dạng JSON Object thay vì Array
    COALESCE(
      JSON_OBJECT(
        'bill_id', b.bill_id,
        'user_id', b.user_id,
        'order_status', b.order_status,
        'total_amount', b.total_amount,
        'payment_method', b.payment_method,
        'online_provider', b.online_provider,
        'payment_status', b.payment_status,
        'created_at', b.created_at,
        'updated_at', b.updated_at,
        'bill_items', COALESCE(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'bill_item_id', bi.bill_item_id,
                'food_id', bi.food_id,
                'price_at_purchase', bi.price_at_purchase,
                'name_at_purchase', bi.name_at_purchase,
                'quantity', bi.quantity
              )
            ) 
            FROM bill_items bi WHERE bi.bill_id = b.bill_id
          ), JSON_ARRAY()
        )
      ), NULL
    ) AS bill
FROM reservations r
JOIN bills b ON r.reservation_id = b.reservation_id
JOIN tables tb ON r.table_id = tb.table_id
WHERE b.bill_id = ?
GROUP BY r.reservation_id,b.bill_id;
`;

    const [rows] = await pool.execute(query, [billId]);
    return rows.length ? rows[0] : null;
  },
};

export default billModel;

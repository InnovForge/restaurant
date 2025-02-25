import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

// const reservationModel = {
//   async createReservation(reservationData) {
//     const reservationId = nanoidNumbersOnly(16);
//     const { restaurantId, userId, tableNumber, reservationStatus } = reservationData;

//     try {
//       const sql = `
//             INSERT INTO reservations (reservation_id, restaurant_id, user_id, table_number, reservation_status)
//             VALUES (?, ?, ?, ?, ? )
//         `;

//       const [result] = await pool.execute(sql, [
//         reservationId,
//         restaurantId,
//         userId,
//         tableNumber,
//         reservationStatus,
//       ]);

//       if (result.affectedRows === 1) {
//         return { success: true, reservationId };
//       }
//       return { success: false, message: "Failed to create reservation" };
//     } catch (error) {
//       console.error("Error creating reservation:", error);
//       return { success: false, message: error.message };
//     }
//   },
// };

const reservationModel = {
  async createReservation({ restaurant_id, user_id, table_number, reservation_status }) {
    const reservationId = nanoidNumbersOnly(16);

    try {
      const sql = `
        INSERT INTO reservations (reservation_id, restaurant_id, user_id, table_number, reservation_status)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(sql, [
        reservationId,
        restaurant_id,
        user_id,
        table_number,
        reservation_status,
      ]);

      if (result.affectedRows === 1) {
        return { success: true, reservationId };
      }
      return { success: false, message: "Không thể tạo đặt bàn" };
    } catch (error) {
      console.error("Lỗi khi tạo đặt bàn:", error);
      return { success: false, message: error.message };
    }
  },
  async getReservationsByRestaurantId(restaurantId) {
    try {
      const sql = `
        SELECT r.reservation_id, r.table_number, r.reservation_status, u.full_name, u.phone_number
        FROM reservations r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.restaurant_id = ?
      `;

      const [rows] = await pool.execute(sql, [restaurantId]);
      return rows;
    } catch (error) {
      console.error("Error getting reservations:", error);
      return [];
    }
  },
};

export default reservationModel;

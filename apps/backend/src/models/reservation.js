import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const reservationModel = {
  async createReservation(reservationData) {
    const reservationId = nanoidNumbersOnly(16);
    const { restaurant_id, user_id, table_number, reservation_status } = reservationData;

    try {
      const sql = `
            INSERT INTO reservations (reservation_id, restaurant_id, user_id, table_number, reservation_status)
            VALUES (?, ?, ?,?,?)
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
      return { success: false, message: "Failed to create reservation" };
    } catch (error) {
      console.error("Error creating reservation:", error);
      return { success: false, message: error.message };
    }
  },
};

export default reservationModel;

import { pool } from "../configs/mysql.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const restaurantModel = {
  async updateRestaurant(restaurantId, restaurantData) {
    const address = restaurantData.address;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(restaurantData)) {
        if (value !== undefined && value !== null) {
          if (key !== "address") {
            values.push(value);
            fields.push(`${key} = ?`);
          }
        }
      }
      if (fields.length !== 0) {
        values.push(restaurantId);
        const sql = `UPDATE restaurants SET ${fields.join(", ")} WHERE restaurant_id = ?`;
        await connection.query(sql, values);
      }

      const fieldsAddress = [];
      const valuesAddress = [];
      for (const [key, value] of Object.entries(address)) {
        if (value !== undefined && value !== null) {
          valuesAddress.push(value);
          fieldsAddress.push(`${key} = ?`);
        }
      }
      if (fieldsAddress.length !== 0) {
        valuesAddress.push(restaurantId);
        const sqlAddress = `UPDATE addresses SET ${fieldsAddress.join(", ")} WHERE address_id = ?`;
        await connection.query(sqlAddress, valuesAddress);
      }
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error(error);
    } finally {
      connection.release();
    }
  },

  /*
   * Create a restaurant
   * @param {string} userId - ID of the user who creates the restaurant
   * @param {Object} restaurantData - Data of the restaurant
   * @param {string} restaurantData.name - Name of the restaurant
   * @param {Object} restaurantData.address - Address of the restaurant
   * @param {string} restaurantData.phoneNumber - Phone number of the restaurant
   * @param {string} restaurantData.coverUrl - Cover URL of the restaurant
   */
  async createRestaurant(userId, restaurantData) {
    const { name, address, phoneNumber, email } = restaurantData;
    const { addressLine1, addressLine2, longitude, latitude } = address;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const addressId = nanoidNumbersOnly();
      const restaurantId = nanoidNumbersOnly();

      await connection.query(
        "INSERT INTO addresses (address_id, address_line1, address_line2, longitude, latitude) VALUES (?, ?, ?, ?, ?)",
        [addressId, addressLine1, addressLine2, longitude, latitude],
      );

      await connection.query(
        "INSERT INTO restaurants (restaurant_id, name, phone_number,email, address_id) VALUES (?, ?, ?, ?, ?)",
        [restaurantId, name, phoneNumber, email, addressId],
      );

      await connection.query("INSERT INTO restaurant_managers (user_id, restaurant_id, role) VALUES (?, ?, ?)", [
        userId,
        restaurantId,
        "owner",
      ]);

      await connection.commit();
      return restaurantId;
    } catch (error) {
      await connection.rollback();
      throw new Error(error);
    } finally {
      connection.release();
    }
  },

  async getUserRestaurantRole(userId, restaurantId) {
    const [rows] = await pool.query("SELECT role FROM restaurant_managers WHERE user_id = ? AND restaurant_id = ?", [
      userId,
      restaurantId,
    ]);
    return rows.length > 0 ? rows[0].role : null;
  },
  async getRestaurant(restaurantId) {
    const [rows] = await pool.query(
      `SELECT r.restaurant_id, r.name, r.phone_number,r.email, a.address_line1, a.address_line2, a.longitude, a.latitude
      FROM restaurants r
      JOIN addresses a ON r.address_id = a.address_id
      WHERE r.restaurant_id = ?`,
      [restaurantId],
    );
    return rows[0];
  },

  async getRestaurantByUserId(userId) {
    const [rows] = await pool.query(
      `
SELECT 
    r.restaurant_id,
    r.name AS restaurant_name,
    r.phone_number,
    r.email,
    r.logo_url,
    r.cover_url,
    rm.role,
    r.created_at,
    r.updated_at
FROM 
    restaurant_managers rm
JOIN 
    restaurants r ON rm.restaurant_id = r.restaurant_id
WHERE 
    rm.user_id = ?;

`,
      [userId],
    );
    return rows;
  },
};

export default restaurantModel;

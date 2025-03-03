import bcrypt from "bcryptjs";
import { nanoidNumbersOnly } from "../utils/nanoid.js";
import { pool } from "../configs/mysql.js";
import { uploadFileUser } from "../utils/s3.js";
import { toPng } from "jdenticon";
import { user } from "../sockets/user-manager.js";
// import { getBillsByUserId } from "../controllers/user.js";

const userModel = {
  /**
   * Lấy thông tin một người dùng theo ID.
   * @param {number} userId - ID của người dùng.
   * @returns {Promise<Object|null>} Người dùng hoặc `null` nếu không tìm thấy.
   */
  async getUserById(userId) {
    const query = `SELECT 
    u.user_id,
    u.name,
    u.username,
    u.email,
    u.avatar_url,
    IF(
        COUNT(a.address_id) = 0, 
        '[]', 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'address_id', a.address_id,
                'address_line1', a.address_line1,
                'address_line2', a.address_line2,
                'longitude', a.longitude,
                'latitude', a.latitude,
                'is_default', ua.is_default,
                'created_at', a.created_at,
                'updated_at', a.updated_at
            )
        )
    ) AS addresses
FROM users u
LEFT JOIN user_addresses ua ON u.user_id = ua.user_id
LEFT JOIN addresses a ON ua.address_id = a.address_id
WHERE u.user_id = ?
GROUP BY u.user_id;
`;

    const [rows] = await pool.query(query, [userId]);
    if (rows.length > 0) {
      rows[0].addresses = JSON.parse(rows[0].addresses);
    }
    return rows[0] || null;
  },

  /**
   * Lấy thông tin một người dùng theo username.
   * @param {string} username - Tên đăng nhập của người dùng.
   * @returns {Promise<Object|null>} Người dùng hoặc `null` nếu không tìm thấy.
   */
  async getUserByUsername(username) {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0] || null;
  },

  async getUser(userId) {
    const [rows] = await pool.query("SELECT * FROM users WHERE userid = ?", [userId]);
    return rows[0] || null;
  },

  async getBillsByUserId(userId) {
    // try {
    //   const query = "SELECT * FROM users WHERE user_id = ?";
    //   console.log(query, userId);
    //   const [rows] = await pool.query(query, [userId]);
    //   console.log(rows);
    //   return rows || null;
    // } catch (error) {
    //   console.error("Database error:", error);
    //   throw error;
    // }

    try {
      const query = `
        SELECT 
            b.bill_id, 
            b.order_status,
            b.created_at,
            r.name AS restaurant_name,
            r.phone_number AS restaurant_phone,
            r.logo_url AS restaurant_logo,
            bi.bill_item_id,
            bi.food_id,
            f.name AS food_name,
            f.image_url AS food_image_url,
            bi.quantity,
            f.price,
            rev.rating,
            rev.comment
        FROM bills b
        JOIN restaurants r ON b.restaurant_id = r.restaurant_id
        JOIN bill_items bi ON b.bill_id = bi.bill_id
        JOIN foods f ON bi.food_id = f.food_id
        LEFT JOIN reviews rev ON rev.bill_id = b.bill_id 
        WHERE b.user_id = ?;
      `;

      const [rows] = await pool.query(query, [userId]);

      // Gom nhóm dữ liệu theo bill_id
      const bills = {};
      rows.forEach((row) => {
        if (!bills[row.bill_id]) {
          bills[row.bill_id] = {
            bill_id: row.bill_id,
            order_status: row.order_status,
            created_at: row.created_at,
            restaurant: {
              name: row.restaurant_name,
              logo_url: row.restaurant_logo,
              phone: row.restaurant_phone,
            },
            items: [],
          };
        }
        bills[row.bill_id].items.push({
          bill_item_id: row.bill_item_id,
          food_id: row.food_id,
          food_name: row.food_name,
          image_url: row.food_image_url,
          quantity: row.quantity,
          price: row.price,
          rating: row.rating || null,
          comment: row.comment || null,
        });
      });

      return Object.values(bills);
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  },

  /**
   * Thêm một người dùng mới.
   * @param {Object} userData - Dữ liệu của người dùng mới.
   * @param {string} userData.username - Tên đăng nhập.
   * @param {string} userData.name - Tên hiển thị.
   * @param {string} userData.password - Mật khẩu.
   * @returns {Promise<boolean>} `true` nếu thêm thành công, `false` nếu không.
   */
  async createUser(userData) {
    const nanoid = nanoidNumbersOnly();
    const { username, name, password, gender, email, phoneNumber } = userData;

    const avatar = toPng(username, 512);
    const avatar_url = await uploadFileUser(`${nanoid}/avatar`, {
      buffer: avatar,
      size: avatar.length,
      mimetype: "image/png",
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (user_id, username, avatar_url, name, password, gender) VALUES (?, ?, ?, ?, ?, ?)",
      [nanoid, username, avatar_url, name, hashedPassword, gender],
    );

    return result.afterInsertId > 0;
  },

  async updateUserAddresss(userId, addressId, addressData) {
    if (!userId || !addressId) return false;

    const userAddressKeys = new Set(["is_default", "phone_number"]);

    const checkQuery = `
        SELECT 1 FROM user_addresses ua 
        JOIN addresses a ON ua.address_id = a.address_id
        WHERE ua.user_id = ? AND a.address_id = ?;
    `;
    const [existingRecords] = await pool.query(checkQuery, [userId, addressId]);

    if (existingRecords.length === 0) return false;

    const addressUpdates = [];
    const addressValues = [];
    const userAddressUpdates = [];
    const userAddressValues = [];
    let shouldUnsetDefault = false;

    for (const [field, value] of Object.entries(addressData)) {
      if (value === undefined || value === null) continue;

      if (userAddressKeys.has(field)) {
        userAddressUpdates.push(`${field} = ?`);
        userAddressValues.push(value);

        if (field === "is_default" && value === true) {
          shouldUnsetDefault = true;
        }
      } else {
        addressUpdates.push(`${field} = ?`);
        addressValues.push(value);
      }
    }

    const updateQueries = [];

    if (shouldUnsetDefault) {
      updateQueries.push(
        pool.query(`UPDATE user_addresses SET is_default = false WHERE user_id = ? AND address_id != ?`, [
          userId,
          addressId,
        ]),
      );
    }

    if (addressUpdates.length) {
      addressValues.push(addressId);
      updateQueries.push(
        pool.query(`UPDATE addresses SET ${addressUpdates.join(", ")} WHERE address_id = ?`, addressValues),
      );
    }

    if (userAddressUpdates.length) {
      userAddressValues.push(addressId);
      updateQueries.push(
        pool.query(
          `UPDATE user_addresses SET ${userAddressUpdates.join(", ")} WHERE address_id = ?`,
          userAddressValues,
        ),
      );
    }

    if (updateQueries.length) await Promise.all(updateQueries);

    return true;
  },

  async createUserAddress(userId, addressData) {
    if (!userId) return false;
    const { address_line1, address_line2, longitude, latitude, phone_number, is_default } = addressData;

    const addressId = nanoidNumbersOnly();

    const [addressResult] = await pool.query(
      "INSERT INTO addresses (address_id, address_line1, address_line2, longitude, latitude) VALUES (?, ?, ?, ?, ?)",
      [addressId, address_line1, address_line2, longitude, latitude],
    );

    if (addressResult.affectedRows === 0) return false;

    const userAddressId = nanoidNumbersOnly();

    if (is_default) {
      await pool.query("UPDATE user_addresses SET is_default = false WHERE user_id = ?", [userId]);
    }

    const [userAddressResult] = await pool.query(
      "INSERT INTO user_addresses (user_address_id, address_id, user_id, phone_number, is_default) VALUES (?, ?, ?, ?, ?)",
      [userAddressId, addressId, userId, phone_number, is_default],
    );
    return userAddressResult.affectedRows && userAddressResult.affectedRows > 0;
  },

  async deleteUserAddress(userId, addressId) {
    if (!userId || !addressId) return false;

    const [result] = await pool.query("DELETE FROM user_addresses WHERE user_id = ? AND address_id = ?", [
      userId,
      addressId,
    ]);

    const [addressResult] = await pool.query("DELETE FROM addresses WHERE address_id = ?", [addressId]);

    return result.affectedRows > 0 && addressResult.affectedRows > 0;
  },

  /**
   * Cập nhật thông tin người dùng.
   * @param {string} userId - ID của người dùng.
   * @param {Object} userData - Dữ liệu cần cập nhật.
   * @param {string} [userData.name] - Tên mới của người dùng (tùy chọn).
   * @param {string} [userData.email] - Email mới của người dùng (tùy chọn).
   * @param {string} [userData.password] - Mật khẩu mới (nếu có sẽ được mã hóa).
   * @param {string} [userData.phone_number] - Số điện thoại mới (tùy chọn).
   * @returns {Promise<boolean>} `true` nếu cập nhật thành công, `false` nếu không có thay đổi.
   */
  async updateUser(userId, userData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(userData)) {
      if (value !== undefined && value !== null) {
        if (key === "password") {
          values.push(await bcrypt.hash(value, 10));
        } else {
          values.push(value);
        }
        fields.push(`${key} = ?`);
      }
    }

    if (fields.length === 0) return false;
    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
    const [result] = await pool.query(sql, values);
    return result.affectedRows > 0;
  },

  /**
   * Xóa một người dùng.
   * @param {number} userId - ID của người dùng.
   * @returns {Promise<boolean>} `true` nếu xóa thành công, `false` nếu không.
   */
  async deleteUser(userId) {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    return result.affectedRows > 0;
  },
};

export default userModel;

import bcrypt from "bcryptjs";
import { nanoidNumbersOnly } from "../utils/nanoid.js";
import { pool } from "../configs/mysql.js";

const userModel = {
  /**
   * Lấy danh sách tất cả người dùng.
   * @returns {Promise<Array>} Danh sách người dùng.
   */
  async getAllUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  },

  /**
   * Lấy thông tin một người dùng theo ID.
   * @param {number} userId - ID của người dùng.
   * @returns {Promise<Object|null>} Người dùng hoặc `null` nếu không tìm thấy.
   */
  async getUserById(userId) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    return rows[0] || null;
  },

  /**
   * Thêm một người dùng mới.
   * @param {Object} userData - Dữ liệu của người dùng (name, email, etc.).
   * @returns {Promise<number>} ID của người dùng vừa thêm.
   */
  async createUser(userData) {
    const nanoid = nanoidNumbersOnly();
    const { username, name, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(nanoid, username, name, email, hashedPassword);

    const [result] = await pool.query(
      "INSERT INTO users (user_id, username, name, password, email) VALUES (?, ?, ?, ?, ?)",
      [nanoid, username, name, hashedPassword, email],
    );
    // console.log(result)
    //	return result.insertId
  },

  /**
   * Cập nhật thông tin người dùng.
   *
   * @param {string} userId - ID của người dùng.
   * @param {Object} userData - Dữ liệu cần cập nhật.
   * @param {string} [userData.name] - Tên mới của người dùng (tùy chọn).
   * @param {string} [userData.email] - Email mới của người dùng (tùy chọn).
   * @param {string} [userData.password] - Mật khẩu mới (nếu có sẽ được mã hóa).
   * @param {string} [userData.phone_number] - Số điện thoại mới (tùy chọn).
   * @param {string} [userData.avatar_url] - URL ảnh đại diện mới (tùy chọn).
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
    // console.log(fields,values);

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
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      userId,
    ]);
    return result.affectedRows > 0;
  },
};

export default userModel;

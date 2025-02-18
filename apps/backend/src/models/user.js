import bcrypt from "bcryptjs";
import { nanoidNumbersOnly } from "../utils/nanoid.js";
import { pool } from "../configs/mysql.js";
import { uploadFileUser } from "../utils/s3.js";
import { toPng } from "jdenticon";

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
    const { username, name, password } = userData;

    const avatar = toPng(username, 512);
    const avatar_url = await uploadFileUser(`${nanoid}/avatar`, {
      buffer: avatar,
      size: avatar.length,
      mimetype: "image/png",
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (user_id, username, avatar_url, name, password) VALUES (?, ?, ?, ?, ?)",
      [nanoid, username, avatar_url, name, hashedPassword],
    );

    return result.afterInsertId > 0;
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
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    return result.affectedRows > 0;
  },
};

export default userModel;

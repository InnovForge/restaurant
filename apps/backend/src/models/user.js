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
	 * @param {number} userId - ID của người dùng.
	 * @param {Object} userData - Dữ liệu cập nhật (name, email, etc.).
	 * @returns {Promise<boolean>} `true` nếu cập nhật thành công, `false` nếu không.
	 */
	async updateUser(userId, userData) {
		const { name, email, password } = userData;
		const [result] = await pool.query(
			"UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
			[name, email, password, userId],
		);
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

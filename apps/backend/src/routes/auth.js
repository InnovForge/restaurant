import { Router } from "express";
import * as authController from "../controllers/auth.js";
const router = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: đăng nhập người dùng
 *     tags:
 *       - auth
 *     description: Đăng nhập người dùng.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: team1
 *               password:
 *                 type: string
 *                 format: password
 *                 example: cdio@team1
 *     responses:
 *       200:
 *         description: User login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login successfully
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *        description: Unauthorized, invalid username or password
 *       500:
 *         description: Internal server error
 */

router.post("/auth/login", authController.login);

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: đăng ký người dùng
 *     tags:
 *       - auth
 *     description: Đăng ký một người dùng mới.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *                 example: team1
 *               password:
 *                 type: string
 *                 format: password
 *                 example: cdio@team1
 *               name:
 *                 type: string
 *                 example: team1
 *     responses:
 *       201:
 *         description: User created successfully (đã tạo người dùng thành công)
 *       400:
 *         description: Bad request, invalid input (yêu cầu không hợp lệ, đầu vào không hợp lệ)
 *       500:
 *         description: Internal server error
 */
router.post("/auth/register", authController.register);

router.post("/auth/refreshToken", authController.refreshToken);
export default router;

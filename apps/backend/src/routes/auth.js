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
 *         $ref: "#/components/responses/200"
 *       401:
 *         description: Unauthorized
 *         content:
 *            application/json:
 *             schema:
 *              type: object
 *              properties:
 *                 status:
 *                  type: string
 *                  example: "error"
 *                 code:
 *                  type: integer
 *                  example: 401
 *                 message:
 *                  type: string,
 *                  example: "Unauthorized, invalid username or password"
 *       500:
 *         $ref: "#/components/responses/500"
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
 *         $ref: "#/components/responses/201"
 *       400:
 *         $ref: "#/components/responses/400"
 *       500:
 *         $ref: "#/components/responses/500"
 */
router.post("/auth/register", authController.register);

router.post("/auth/refreshToken", authController.refreshToken);
export default router;

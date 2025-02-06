import { Router } from "express";
import * as authController from "../controllers/auth.js";
const router = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: login a user
 *     tags:
 *       - auth
 *     description: login with the provided details.
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
 *     summary: register a user
 *     tags:
 *       - auth
 *     description: register with the provided details.
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
 *         description: User created successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/auth/register", authController.register);

router.post("/auth/refreshToken", authController.refreshToken);
export default router;

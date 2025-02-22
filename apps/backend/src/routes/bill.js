import { Router } from "express";
import * as billController from "../controllers/bill.js";
import { authRestaurant, ROLE } from "../middlewares/roleRestaurant.js";
import { authenticateJWT } from "../middlewares/authenticate.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
router.use("/bill", authenticateJWT);

/**
 * @openapi
 * /api/v1/bill/:
 *   post:
 *     summary: Tạo bill mới
 *     tags:
 *       - bill
 *     responses:
 *        201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Your request was successful. The resource has been created."
 *                 data:
 *                   type: object
 *                   properties:
 *                     foodId:
 *                       type: string
 *                       example: "123456789101112"
 *         400:
 *          $ref: '#/components/responses/400'
 *         401:
 *          $ref: '#/components/responses/401'
 *         403:
 *          $ref: '#/components/responses/403'
 *         500:
 *          $ref: '#/components/responses/500'
 */
router.post("/bill", billController.createBill);

export default router;

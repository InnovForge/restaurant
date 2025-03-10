import { Router } from "express";
import * as billController from "../controllers/bill.js";
import { authenticateJWT } from "../middlewares/authenticate.js";
import { ro } from "@faker-js/faker";

const router = Router();

/**
 * @openapi
 * /api/v1/bills/{billId}:
 *   get:
 *     summary: Lấy thông tin hóa đơn
 *     tags:
 *       - bill
 *     parameters:
 *       - in: path
 *         name: billId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hóa đơn
 *     responses:
 *       200:
 *         description: Thông tin hóa đơn
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
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Bill loaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     bill:
 *                       type: object
 *                       properties:
 *                         bill_id:
 *                           type: string
 *                           example: "123456789101112"
 *                         restaurant_id:
 *                           type: string
 *                           example: "987654321098765"
 *                         user_id:
 *                           type: string
 *                           example: "123456789101112"
 *                         order_status:
 *                           type: string
 *                           example: "pending"
 *                         reservation_id:
 *                           type: string
 *                           example: "987654321098765"
 *                         payment_method:
 *                           type: string
 *                           example: "cash"
 *                         payment_status:
 *                           type: string
 *                           example: "unpaid"
 *                         created_at:
 *                           type: string
 *                           example: "2024-03-10T12:34:56Z"
 *       404:
 *         $ref: '#/components/responses/404'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get("/bills/:billId", authenticateJWT, billController.loadBill);

/**
 * @openapi
 * /api/v1/bills/{billId}/items:
 *   get:
 *     summary: Lấy danh sách các mục hóa đơn
 *     tags:
 *       - bill
 *     parameters:
 *       - in: path
 *         name: billId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hóa đơn
 *     responses:
 *       200:
 *         description: Danh sách các mục hóa đơn
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
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Bill items loaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     billItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           bill_item_id:
 *                             type: string
 *                             example: "123456789101112"
 *                           food_id:
 *                             type: string
 *                             example: "987654321098765"
 *                           price_at_purchase:
 *                             type: number
 *                             example: 100000
 *                           name_at_purchase:
 *                             type: string
 *                             example: "Cá mập nướng sốt trung hoa"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *       404:
 *         $ref: '#/components/responses/404'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get("/bills/:billId/items", authenticateJWT, billController.loadBillItem);

router.get("/bills/:billId", authenticateJWT, billController.getBillById);

export default router;

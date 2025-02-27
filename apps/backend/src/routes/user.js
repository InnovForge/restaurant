import { Router } from "express";
import * as userController from "../controllers/user.js";
import * as restaurantController from "../controllers/restaurant.js";
import multer from "multer";
import { authenticateJWT } from "../middlewares/authenticate.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.use("/users", authenticateJWT);

router.patch("/users/me", userController.updateUser);

router.patch("/users/me/avatar", upload.single("avatar"), userController.updateUserAvatar);

router.get("/users/me", userController.getUserFromToken);

/**
 * @openapi
 * /api/v1/users/me/restaurants:
 *   get:
 *     summary: Hiển thị thông tin nhà hàng của user
 *     tags:
 *       - restaurant
 *     description: Hiển thị thông tin nhà hàng mà user đang sở hữu hoặc quản lý
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin nhà hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Your request was processed successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       restaurantId:
 *                         type: string
 *                         example: "1121277111694933"
 *                       restaurantName:
 *                         type: string
 *                         example: "Bistro Cafe 2"
 *                       phoneNumber:
 *                         type: string
 *                         example: "0123456789"
 *                       logoUrl:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       coverUrl:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       role:
 *                         type: string
 *                         example: "owner"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-21T00:16:54.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-21T00:16:54.000Z"
 *       401:
 *         $ref: '#/components/responses/401'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get("/users/me/restaurants", restaurantController.getRestaurantByUserId);

router.get("/users/:id", userController.getUser);

router.get("/users/name/:name", userController.getUserName);

router.get("/users/:id/bill", userController.getBillsByUserId);

export default router;

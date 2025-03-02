import { Router } from "express";
import * as userController from "../controllers/user.js";
import * as restaurantController from "../controllers/restaurant.js";
import multer from "multer";
import { authenticateJWT } from "../middlewares/authenticate.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.use("/users", authenticateJWT);

/**
 * @openapi
 * /api/v1/users/me:
 *   patch:
 *     summary: Cập nhật thông tin người dùng
 *     tags:
 *       - user
 *     description: Cập nhật thông tin cá nhân của người dùng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "NewPassw0rd!"
 *               phoneNumber:
 *                 type: string
 *                 example: "0123456789"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
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
 *                   example: "User information has been updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "12345678910"
 *                     name:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     email:
 *                       type: string
 *                       example: "example@example.com"
 *                     username:
 *                       type: string
 *                       example: "username123"
 *                     phoneNumber:
 *                       type: string
 *                       example: "0123456789"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid input data."
 *       401:
 *         $ref: '#/components/responses/401'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.patch("/users/me", userController.updateUser);

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     summary: Lấy thông tin người dùng từ token
 *     tags:
 *       - user
 *     description: Lấy thông tin người dùng dựa trên token xác thực
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
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
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "12345678910"
 *                     name:
 *                       type: string
 *                       example: "cdio team 1"
 *                     username:
 *                       type: string
 *                       example: "team1"
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     avatarUrl:
 *                       type: string
 *                       example: "http://localhost:9002/users/12345678910/avatar"
 *                     addresses:
 *                       type: array
 *                       items:
 *                         type: object
 *                       example: []
 *       401:
 *         $ref: '#/components/responses/401'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get("/users/me", userController.getUserFromToken);

/**
 * @openapi
 * /api/v1/users/me/avatar:
 *   patch:
 *     summary: Cập nhật ảnh đại diện của người dùng
 *     tags:
 *       - user
 *     description: Cho phép người dùng cập nhật ảnh đại diện của họ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh đại diện mới của người dùng
 *     responses:
 *       200:
 *         description: Cập nhật ảnh đại diện thành công
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
 *                   example: "Avatar has been updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatarUrl:
 *                       type: string
 *                       example: "https://example.com/path/to/avatar.jpg"
 *       400:
 *         description: File upload không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid file type or size."
 *       401:
 *         $ref: '#/components/responses/401'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.patch("/users/me/avatar", upload.single("avatar"), userController.updateUserAvatar);

router.patch("/users/me/addresses/:addressId", userController.updateUserAddress);

router.delete("/users/me/addresses/:addressId", userController.deleteUserAddress);

router.post("/users/me/addresses", userController.createUserAddress);

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

router.get("/users/me/bills", userController.getBillsByUserId);

export default router;

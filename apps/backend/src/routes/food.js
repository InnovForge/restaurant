import { Router } from "express";
import * as foodController from "../controllers/food.js";
import { authRestaurant, ROLE } from "../middlewares/roleRestaurant.js";
import { authenticateJWT } from "../middlewares/authenticate.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
router.use("/restaurant", authenticateJWT);

/**
 * @openapi
 * /api/v1/restaurant/{restaurantId}/food:
 *   post:
 *     summary: Tạo một món ăn mới
 *     tags:
 *       - food
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant ID (id của nhà hàng)
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
router.post("/restaurant/:restaurantId/food", authRestaurant([ROLE.owner, ROLE.manager]), foodController.createFood);

/**
 * @openapi
 * /api/v1/restaurant/{restaurantId}/food/{foodId}:
 *   patch:
 *     summary: Cập nhật thông tin món ăn
 *     tags:
 *       - food
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The restaurant ID (id của nhà hàng)
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: The food ID (id của món ăn)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bún chả"
 *                 description: Tên món ăn
 *               price:
 *                 type: string
 *                 example: 50000
 *                 description: Giá món ăn
 *               description:
 *                 type: string
 *                 example: "Món ăn ngon"
 *                 description: Mô tả món ăn
 *             required:
 *               - name
 *               - price
 *               - description
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200'
 *       400:
 *         $ref: '#/components/responses/400'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.patch(
  "/restaurant/:restaurantId/food/:foodId",
  authRestaurant([ROLE.owner, ROLE.manager]),
  foodController.updateFood,
);

/**
 * @openapi
 * /api/v1/restaurant/{restaurantId}/food/{foodId}/image:
 *   patch:
 *     summary: Upload ảnh cho món ăn của nhà hàng
 *     tags:
 *       - food
 *     description: Upload ảnh cho món ăn của nhà hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: ID của nhà hàng
 *         schema:
 *           type: string
 *           example: "123456"
 *       - in: path
 *         name: foodId
 *         required: true
 *         description: ID của món ăn
 *         schema:
 *           type: string
 *           example: "654321"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200'
 *       400:
 *         $ref: '#/components/responses/400'
 *       401:
 *         $ref: '#/components/responses/401'
 *       403:
 *         $ref: '#/components/responses/403'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.patch(
  "/restaurant/:restaurantId/food/:foodId/image",
  authRestaurant([ROLE.owner, ROLE.manager]),
  upload.single("image"),
  foodController.uploadFoodImage,
);

export default router;

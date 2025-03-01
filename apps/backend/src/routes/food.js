import { Router } from "express";
import * as foodController from "../controllers/food.js";
import { authRestaurant, ROLE } from "../middlewares/roleRestaurant.js";
import { authenticateJWT } from "../middlewares/authenticate.js";
import multer from "multer";
import { apiCache } from "../middlewares/apiCache.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
router.use("/restaurants", authenticateJWT);

/**
 * @openapi
 * /api/v1/restaurants/{restaurantId}/foods:
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
router.post("/restaurants/:restaurantId/foods", authRestaurant([ROLE.owner, ROLE.manager]), foodController.createFood);

/**
 * @openapi
 * /api/v1/restaurants/{restaurantId}/foods/{foodId}:
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
  "/restaurants/:restaurantId/foods/:foodId",
  authRestaurant([ROLE.owner, ROLE.manager]),
  foodController.updateFood,
);

/**
 * @openapi
 * /api/v1/restaurants/{restaurantId}/foods/{foodId}/image:
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
  "/restaurants/:restaurantId/foods/:foodId/image",
  authRestaurant([ROLE.owner, ROLE.manager]),
  upload.single("image"),
  foodController.uploadFoodImage,
);

/**
 * @openapi
 * /api/v1/foods:
 *   get:
 *     summary: Lấy danh sách món ăn của nhà hàng
 *     tags:
 *       - food
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: string
 *           example: 16.060035
 *         description: Vĩ độ của vị trí hiện tại
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: string
 *           example: 108.209648
 *         description: Kinh độ của vị trí hiện tại
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10000
 *         description: Bán kính tìm kiếm (mét)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *         type: integer
 *         default: 1
 *         description: Số trang hiện tại
 *     responses:
 *       200:
 *         description: OK
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
 *                   example: "Your request was processed successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       restaurantName:
 *                         type: string
 *                         example: "Cơm Hà Nội"
 *                       restaurantId:
 *                         type: string
 *                         example: "3470463054406434"
 *                       addressLine1:
 *                         type: string
 *                         example: "Da Nang"
 *                       addressLine2:
 *                         type: string
 *                         example: "Suite 456"
 *                       longitude:
 *                         type: string
 *                         example: "108.22150000"
 *                       latitude:
 *                         type: string
 *                         example: "16.06850000"
 *                       foods:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             foodId:
 *                               type: string
 *                               example: "5098209683571802"
 *                             name:
 *                               type: string
 *                               example: "Cơm gà"
 *                             price:
 *                               type: integer
 *                               example: 20000
 *                             description:
 *                               type: string
 *                               example: "Cơm siêu ngon"
 *                             imageUrl:
 *                               type: string
 *                               nullable: true
 *                               example: "https://example.com/image.jpg"
 *                             totalReview:
 *                               type: integer
 *                               example: 0
 *                             averageRating:
 *                               type: number
 *                               example: 0
 *                       distanceInfo:
 *                         type: object
 *                         properties:
 *                           straightLineDistance:
 *                             type: number
 *                             example: 1577.911052409428
 *                           distance:
 *                             type: number
 *                             example: 2091
 *                           distanceUnits:
 *                             type: string
 *                             example: "meters"
 *                           duration:
 *                             type: number
 *                             example: 3.072866666666667
 *                           durationUnits:
 *                             type: string
 *                             example: "minutes"
 *       400:
 *         $ref: '#/components/responses/400'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get("/foods", apiCache, foodController.getFoods);

export default router;

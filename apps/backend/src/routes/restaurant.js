import { Router } from "express";
import * as restaurantController from "../controllers/restaurant.js";
import { authenticateJWT } from "../middlewares/authenticate.js";
import multer from "multer";
import { authRestaurant, ROLE } from "../middlewares/roleRestaurant.js";
import { apiCache } from "../middlewares/apiCache.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
// router.use("/restaurants", authenticateJWT);
//
/**
 * @openapi
 * /api/v1/restaurants:
 *   post:
 *     summary: Đăng ký một nhà hàng
 *     tags:
 *       - restaurant
 *     description: Đăng ký một nhà hàng với thông tin cần thiết.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nhà hàng A"
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\d{10,15}$"
 *                 example: "03673920124"
 *               address:
 *                 type: object
 *                 required:
 *                   - addressLine1
 *                   - longitude
 *                   - latitude
 *                 properties:
 *                   addressLine1:
 *                     type: string
 *                     example: "123 Nguyễn Trãi"
 *                   addressLine2:
 *                     type: string
 *                     example: "P.7, Q.5"
 *                   longitude:
 *                     type: number
 *                     example: 106.694
 *                   latitude:
 *                     type: number
 *                     example: 10.762
 *     responses:
 *       201:
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
 *                     restaurantId:
 *                       type: string
 *                       example: "123456789101112"
 *       400:
 *         $ref: '#/components/responses/400'
 *       401:
 *         $ref: '#/components/responses/401'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.post("/restaurants", authenticateJWT, restaurantController.createRestaurant);

router.get("/restaurants", apiCache, restaurantController.getPopularRestaurants);

/**
 * @openapi
 * /api/v1/restaurants/{restaurantId}:
 *   patch:
 *     summary: Cập nhật thông tin nhà hàng
 *     tags:
 *       - restaurant
 *     description: Cập nhật thông tin nhà hàng
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nhà hàng A"
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\d{10,15}$"
 *                 example: "03673920124"
 *               address:
 *                 type: object
 *                 required:
 *                   - addressLine1
 *                   - longitude
 *                   - latitude
 *                 properties:
 *                   addressLine1:
 *                     type: string
 *                     example: "123 Nguyễn Trãi"
 *                   addressLine2:
 *                     type: string
 *                     example: "P.7, Q.5"
 *                   longitude:
 *                     type: number
 *                     example: 106.694
 *                   latitude:
 *                     type: number
 *                     example: 10.762
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
  "/restaurants/:restaurantId",
  authenticateJWT,
  authRestaurant([ROLE.owner, ROLE.manager]),
  restaurantController.updateRestaurant,
);

/**
 * @openapi
 * /api/v1/restaurants/{restaurantId}/images:
 *   patch:
 *     summary: upload ảnh cho nhà hàng
 *     tags:
 *       - restaurant
 *     description: upload ảnh cho nhà hàng
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: ID của nhà hàng
 *         schema:
 *           type: string
 *           example: "123456"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverUrl:
 *                 type: string
 *                 format: binary
 *               logoUrl:
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
  "/restaurants/:restaurantId/images",
  authenticateJWT,
  authRestaurant([ROLE.owner, ROLE.manager]),
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  restaurantController.uploadRestaurantImage,
);

/**
 * @openapi
 * /api/v1/restaurants/{restaurantId}:
 *   get:
 *     summary: Hiển thị thông tin nhà hàng
 *     tags:
 *       - restaurant
 *     description: Hiển thị thông tin nhà hàng
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nhà hàng A"
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\d{10,15}$"
 *                 example: "03673920124"
 *               address:
 *                 type: object
 *                 required:
 *                   - addressLine1
 *                   - longitude
 *                   - latitude
 *                 properties:
 *                   addressLine1:
 *                     type: string
 *                     example: "123 Nguyễn Trãi"
 *                   addressLine2:
 *                     type: string
 *                     example: "P.7, Q.5"
 *                   longitude:
 *                     type: number
 *                     example: 106.694
 *                   latitude:
 *                     type: number
 *                     example: 10.762
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
router.get("/restaurants/:restaurantId", restaurantController.getRestaurant);

/**
 * @openapi
 * /api/v1/restaurants/{restaurantId}/food:
 *   get:
 *     summary: Hiển thị tất cả món ăn theo nhà hàng
 *     tags:
 *       - restaurant
 *     description: Hiển thị tất cả món ăn theo nhà hàng
 *     tags:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nhà hàng A"
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\d{10,15}$"
 *                 example: "03673920124"
 *               address:
 *                 type: object
 *                 required:
 *                   - addressLine1
 *                   - longitude
 *                   - latitude
 *                 properties:
 *                   addressLine1:
 *                     type: string
 *                     example: "123 Nguyễn Trãi"
 *                   addressLine2:
 *                     type: string
 *                     example: "P.7, Q.5"
 *                   longitude:
 *                     type: number
 *                     example: 106.694
 *                   latitude:
 *                     type: number
 *                     example: 10.762
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
router.get("/restaurants/:restaurantId/foods", authenticateJWT, restaurantController.getAllFoodByResId);
router.get("/restaurants/:restaurantId/bills", authenticateJWT, restaurantController.getBillsByRestaurantId);
router.get("/restaurants/:restaurantId/foods/t", restaurantController.getFoodByRestaurantId);

export default router;

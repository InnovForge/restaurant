import { Router } from "express";
import * as restaurantController from "../controllers/restaurant.js";
import { authenticateJWT } from "../middlewares/auth.js";
import multer from "multer";
import { authRestaurant, ROLE } from "../middlewares/authRestaurant.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
router.use("/restaurant", authenticateJWT);

/**
 * @openapi
 * /api/v1/restaurant:
 *   post:
 *     summary: đăng ký một nhà hàng
 *     tags:
 *       - restaurant
 *     description: đăng ký một nhà hàng với thông tin cần thiết.
 *     security:
 *     - bearerAuth: []
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
 *                 format: phone
 *                 example: "03673920124"
 *               address:
 *                 type: object
 *                 required:
 *                 - addressLine1
 *                 - longitude
 *                 - latitude
 *                 properties:
 *                  addressLine1:
 *                    type: string
 *                    example: "123 Nguyễn Trãi"
 *                  addressLine2:
 *                    string: "P.7, Q.5"
 *                  longitude:
 *                    type: number
 *                    example: 106.694
 *                  latitude:
 *                    type: number
 *                    example: 10.762
 *
 *       201:
 *         description: Restaurant created successfully (đăng ký nhà hàng thành công)
 *       400:
 *         description: Bad request, invalid input (đầu vào không hợp lệ)
 *       500:
 *         description: Internal server error(lỗi máy chủ nội bộ)
 */
router.post("/restaurant", restaurantController.createRestaurant);

/**
 * @openapi
 * /api/v1/restaurant/{id}:
 *   put:
 *     summary: cập nhật thông tin nhà hàng
 *     tags:
 *       - restaurant
 *     description: cập nhật thông tin nhà hàng
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 format: phone
 *                 example: "03673920124"
 *               address:
 *                 type: object
 *                 required:
 *                 - addressLine1
 *                 - longitude
 *                 - latitude
 *                 properties:
 *                  addressLine1:
 *                    type: string
 *                    example: "123 Nguyễn Trãi"
 *                  addressLine2:
 *                    string: "P.7, Q.5"
 *                  longitude:
 *                    type: number
 *                    example: 106.694
 *                  latitude:
 *                    type: number
 *                    example: 10.762
 *     responses:
 *       200:
 *         description: Restaurant updated successfully (cập nhật nhà hàng thành công)
 *       400:
 *         description: Bad request, invalid input (đầu vào không hợp lệ)
 *       500:
 *         description: Internal server error(lỗi máy chủ nội bộ)
 */
router.put("/restaurant/:id", authRestaurant([ROLE.owner, ROLE.manager]), restaurantController.updateRestaurant);

/**
 * @openapi
 * /api/v1/restaurant/{id}/images:
 *   put:
 *     summary: upload ảnh cho nhà hàng
 *     tags:
 *       - restaurant
 *     description: upload ảnh cho nhà hàng
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *       201:
 *         description: "Image uploaded successfully (upload ảnh thành công)"
 *       400:
 *         description: "Bad request, invalid input (đầu vào không hợp lệ)"
 *       403:
 *         description: "Forbidden: You don't have permission to access this resource. (Bạn không có quyền truy cập vào tài nguyên này)"
 */
router.put(
  "/restaurant/:id/images",
  authRestaurant([ROLE.owner, ROLE.manager]),
  upload.fields([
    { name: "coverUrl", maxCount: 1 },
    { name: "logoUrl", maxCount: 1 },
  ]),
  restaurantController.uploadRestaurantImage,
);
export default router;

import { Router } from "express";
import * as geocodeController from "../controllers/geocode.js";
import { apiCache } from "../middlewares/apiCache.js";
const router = Router();

/**
 * @openapi
 * /api/v1/geocode:
 *   get:
 *     summary: tìm kiếm vị trí dựa trên địa chỉ
 *     tags:
 *       - geocode
 *     description: tìm kiếm vị trí dựa trên địa chỉ
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: "127 Nguyễn Văn Linh"
 *         required: true
 *         description: The address (địa chỉ)
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
 *                       title:
 *                         type: string
 *                         example: "127, Đường Nguyễn Văn Linh, Da Nang, Vietnam"
 *                       state:
 *                         type: string
 *                         example: "Da Nang"
 *                       latitude:
 *                         type: number
 *                         example: 16.0605581
 *                       longitude:
 *                         type: number
 *                         example: 108.2158087
 *                       confidence:
 *                         type: number
 *                         example: 1
 *                       importance:
 *                         type: number
 *                         example: 0.35334333333333334
 *                       bbox:
 *                         type: object
 *                         properties:
 *                           lon1:
 *                             type: number
 *                             example: 108.0984118
 *                           lat1:
 *                             type: number
 *                             example: 12.724414
 *                           lon2:
 *                             type: number
 *                             example: 108.1064117
 *                           lat2:
 *                             type: number
 *                             example: 12.7290002
 *         400:
 *          $ref: '#/components/responses/400'
 *         500:
 *          $ref: '#/components/responses/500'
 */
router.get("/geocode", apiCache, geocodeController.geocode);

/**
 * @openapi
 * /api/v1/geocode/reverse:
 *   get:
 *     summary: lấy địa chỉ dựa trên tọa độ
 *     tags:
 *       - geocode
 *     description: Reverse Geocode
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: The latitude (vĩ độ)
 *         example: 16.0605581
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         example: 108.2158087
 *         description: The longitude (kinh độ)
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
 *                       title:
 *                         type: string
 *                         example: "127, Đường Nguyễn Văn Linh, Da Nang, Vietnam"
 *                       state:
 *                         type: string
 *                         example: "Da Nang"
 *                       latitude:
 *                         type: number
 *                         example: 16.0605581
 *                       longitude:
 *                         type: number
 *                         example: 108.2158087
 *         400:
 *          $ref: '#/components/responses/400'
 *         401:
 *          $ref: '#/components/responses/401'
 *         403:
 *          $ref: '#/components/responses/403'
 *         500:
 *          $ref: '#/components/responses/500'
 */
router.get("/geocode/reverse", apiCache, geocodeController.revGeocode);

/**
 * @openapi
 * /api/v1/geocode/ip:
 *   get:
 *     summary: lấy địa chỉ dựa trên IP
 *     tags:
 *       - geocode
 *     description: lấy địa chỉ dựa trên IP
 *     responses:
 *      200:
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
 *                       title:
 *                         type: string
 *                         example: "Da Nang"
 *                       state:
 *                         type: string
 *                         example: "Da Nang"
 *                       latitude:
 *                         type: number
 *                         example: 16.0605581
 *                       longitude:
 *                         type: number
 *                         example: 108.2158087
 *         400:
 *          $ref: '#/components/responses/400'
 *         401:
 *          $ref: '#/components/responses/401'
 *         403:
 *          $ref: '#/components/responses/403'
 *         500:
 *          $ref: '#/components/responses/500'
 */
router.get("/geocode/ip", geocodeController.ipGeocode);

/**
 * @openapi
 * /api/v1/geocode/distance:
 *   get:
 *     summary: Tính khoảng cách giữa 2 địa chỉ
 *     tags:
 *       - geocode
 *     description: Tính khoảng cách giữa 2 địa chỉ
 *     parameters:
 *       - in: query
 *         name: waypoints
 *         schema:
 *           type: string
 *           example: "16.0340309,108.2154818|16.06005675,108.20967039882527"
 *         required: true
 *         description: A list of waypoints to calculate distance (origin and destination)
 *     responses:
 *        200:
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
 *                   type: object
 *                   properties:
 *                     distance:
 *                       type: number
 *                       example: 3734
 *                     distanceUnits:
 *                       type: string
 *                       example: "meters"
 *                     duration:
 *                       type: number
 *                       example: 5.614833333333333
 *                     durationUnits:
 *                       type: string
 *                       example: "minutes"
 *        400:
 *          $ref: '#/components/responses/400'
 *        401:
 *          $ref: '#/components/responses/401'
 *        403:
 *          $ref: '#/components/responses/403'
 *        500:
 *          $ref: '#/components/responses/500'
 */
router.get("/geocode/distance", apiCache, geocodeController.distance);

// router.get("/location", locationController.searchLocationHere);
export default router;

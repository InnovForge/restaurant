import { Router } from "express";
import * as geocodeController from "../controllers/geocode.js";
import { authenticateJWT } from "../middlewares/auth.js";
const router = Router();

router.get("/geocode", geocodeController.geocode);
router.get("/revgeocode",  geocodeController.revGeocode);
router.get("/count-route", geocodeController.countRoute);
// router.get("/location", locationController.searchLocationHere);
export default router;

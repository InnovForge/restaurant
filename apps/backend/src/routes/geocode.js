import { Router } from "express";
import * as geocodeController from "../controllers/geocode.js";
const router = Router();

router.get("/geocode", geocodeController.geocode);
router.get("/geocode/reverse", geocodeController.revGeocode);
router.get("/geocode/ip", geocodeController.ipGeocode);
router.get("/geocode/distance", geocodeController.countRoute);
// router.get("/location", locationController.searchLocationHere);
export default router;

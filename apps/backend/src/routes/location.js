import { Router } from "express";
import * as locationController from "../controllers/location.js";
const router = Router();
router.get("/location", locationController.searchLocation);
export default router;

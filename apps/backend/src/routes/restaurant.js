import { Router } from "express";
import * as restaurantController from "../controllers/restaurant.js";
const router = Router();
router.post("/restaurant", restaurantController.updateRestaurant);
export default router;

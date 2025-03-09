import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticate.js";
import { authRestaurant, ROLE } from "../middlewares/roleRestaurant.js";
import * as ttsController from "../controllers/tss.js";
const router = Router();

router.use("/restaurants", authenticateJWT);
router.post(
  "/restaurants/:restaurantId/tss",
  authRestaurant([ROLE.owner, ROLE.manager, ROLE.staff]),
  ttsController.textToSpeech,
);
export default router;

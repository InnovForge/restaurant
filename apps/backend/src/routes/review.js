import { Router } from "express";
import * as reviewController from "../controllers/review.js";
import { authenticateJWT } from "../middlewares/authenticate.js";

const router = Router();
router.use("/review", authenticateJWT);
router.post("/users/me/reviews", reviewController.addReview);

export default router;

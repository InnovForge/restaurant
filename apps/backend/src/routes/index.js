import { Router } from "express";
import user from "./user.js";
import restaurant from "./restaurant.js";
import geocode from "./geocode.js";
import auth from "./auth.js";
import payment from "./payment.js";
import food from "./food.js";

const router = Router();
router.use("/v1", auth);
router.use("/v1", user);
router.use("/v1", geocode);
router.use("/v1", payment);
router.use("/v1", restaurant);
router.use("/v1", food);

export default router;

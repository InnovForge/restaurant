import { Router } from "express";
import user from "./user.js";
import restaurant from "./restaurant.js";
import geocode from "./geocode.js";

const router = Router();
router.use("/v1", restaurant);
router.use("/v1", user);
router.use("/v1", geocode);

export default router;

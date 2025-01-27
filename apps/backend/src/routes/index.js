import { Router } from "express";
import user from "./user.js";
import resta from "./restaurant.js";
import geocode from "./geocode.js";

const router = Router();
router.use("/v1", resta);
router.use("/v1", user);
router.use("/v1", geocode);

export default router;

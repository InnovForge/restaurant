import { Router } from "express";
import user from "./user.js";
import location from "./location.js";
const router = Router();
router.use("/v1", user);
router.use("/v1", location);

export default router;



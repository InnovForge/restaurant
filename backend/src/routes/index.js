import { Router } from "express";
import user from "./user.js";
import resta from "./restaurant.js";

const router = Router();
router.use("/v1", resta);
router.use("/v1", user);

export default router;



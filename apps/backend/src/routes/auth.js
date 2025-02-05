import { Router } from "express";
import * as authController from "../controllers/auth.js";
const router = Router();

router.get("/auth/login", authController.login);
router.post("/auth/refreshToken", authController.refreshToken);
export default router;

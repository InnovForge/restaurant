import { Router } from "express";
import * as userController from "../controllers/user.js";
const router = Router();
router.post("/restau", userController.createUser);
router.get("/user", userController.getAllUsers);
export default router;

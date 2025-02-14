import { Router } from "express";
import * as userController from "../controllers/user.js";
import multer from "multer";
import { authenticateJWT } from "../middlewares/auth.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.use("/user", authenticateJWT);

router.put("/user", userController.updateUser);

router.put("/user/avatar", upload.single("avatar"), userController.updateUserAvatar);

export default router;

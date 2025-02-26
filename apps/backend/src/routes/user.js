import { Router } from "express";
import * as userController from "../controllers/user.js";
import multer from "multer";
import { authenticateJWT } from "../middlewares/authenticate.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.use("/user", authenticateJWT);

router.patch("/user", userController.updateUser);

router.patch("/user/avatar", upload.single("avatar"), userController.updateUserAvatar);

router.get("/user", userController.getUserFromToken);

router.get("/user/:id", userController.getUser);

router.get("/user/name/:name", userController.getUserName);

router.get("/user/:id/bill", userController.getBillsByUserId);

export default router;

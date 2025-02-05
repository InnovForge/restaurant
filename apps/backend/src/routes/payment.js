import { Router } from "express";
import * as paymentController from "../controllers/payment.js";
import { authenticateJWT } from "../middlewares/auth.js";
const router = Router();
router.use("/payments", authenticateJWT);
router.post("/payments/momo", paymentController.createPaymentMomo);
router.post("/payments/momo/callback", paymentController.callbackPaymentMomo);
export default router;

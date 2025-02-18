import { Router } from "express";
import * as paymentController from "../controllers/payment.js";
import { authenticateJWT } from "../middlewares/authenticate.js";
const router = Router();
router.post("/payments/momo", authenticateJWT, paymentController.createPaymentMomo);
router.post("/payments/momo/callback", paymentController.callbackPaymentMomo);
export default router;

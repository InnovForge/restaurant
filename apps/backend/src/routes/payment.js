import { Router } from "express";
import * as paymentController from "../controllers/payment.js";
const router = Router();
router.post("/payments/momo", paymentController.createPaymentMomo);
router.post("/payments/momo/callback", paymentController.callbackPaymentMomo);
export default router;

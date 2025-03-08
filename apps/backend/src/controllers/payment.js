import { momo } from "../services/payments/momo.js";
import responseHandler from "../utils/response.js";

export const createPaymentMomo = async (req, res) => {
  const { amount, description } = req.body;
  const response = await momo(amount, description);
  return responseHandler.success(res, "Payment created", { url: response });
};

export const callbackPaymentMomo = async (req, res) => {
  const { orderInfo, resultCode } = req.body;
  console.log("MOMO CALLBACK");
  console.log(req.body);
  return res.status(200).json({ message: "success" });
};

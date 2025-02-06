import { momo } from "../services/payments/momo.js";
import responseHandler from "../utils/response.js";

export const createPaymentMomo = async (req, res) => {
  const response = await momo("1000", "test thanh toan");
  return responseHandler.success(res, "Payment created", { url: response });
};

export const callbackPaymentMomo = async (req, res) => {
  const { orderInfo, resultCode } = req.body;
  console.log("MOMO CALLBACK");
  console.log(req.body);
  return res.status(200).json({ message: "success" });
};

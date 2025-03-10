import { momo } from "../services/payments/momo.js";
import responseHandler from "../utils/response.js";

export const createPaymentMomo = async (req, res) => {
  try {
    const { amount, description, billId } = req.body;
    if (amount < 1000) {
      return responseHandler.badRequest(res, "Amount must be greater than 1000");
    }
    const response = await momo(amount, description, billId);
    return responseHandler.created(res, "Payment created", { paymentUrl: response });
  } catch (error) {
    console.log("error", error);
    return responseHandler.internalServerError(res);
  }
};

export const callbackPaymentMomo = async (req, res) => {
  const { orderInfo, resultCode } = req.body;
  console.log("MOMO CALLBACK");
  console.log(req.body);
  return res.status(200).json({ message: "success" });
};

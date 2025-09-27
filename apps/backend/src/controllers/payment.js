import logger from "../configs/logger.js";
import { momo } from "../services/payments/momo.js";
import responseHandler from "../utils/response.js";

export const createPaymentMomo = async (req, res) => {
  try {
    const { amount, description, billId } = req.body;
    if (amount < 1000) {
      return responseHandler.badRequest(res, "Amount must be greater than 1000");
    }
    const response = await momo(amount, description, billId);
    logger.info("MoMo payment response:", response);
    return responseHandler.created(res, "Payment created", { paymentUrl: response });
  } catch (error) {
    logger.error("Error creating MoMo payment:", error);

    return responseHandler.internalServerError(res);
  }
};

export const callbackPaymentMomo = async (req, res) => {
  try {
    const { orderInfo, resultCode } = req.body;
    console.log("MOMO CALLBACK");
    return res.status(200).json({ message: "success" });
  } catch (error) {
    logger.error("Error in MoMo callback:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

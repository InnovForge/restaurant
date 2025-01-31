import { momo } from "../services/payments/momo.js";

export const createPaymentMomo = async (req, res) => {
  const response = await momo("1000", "test thanh toan");
  return res.status(201).json({ url: response });
};

export const callbackPaymentMomo = async (req, res) => {
  const { orderInfo, resultCode } = req.body;
  console.log("MOMO CALLBACK");
  console.log(req.body);
  return res.status(200).json({ message: "success" });
};

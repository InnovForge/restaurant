import billModel from "../models/bill.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

export const createBill = async (req, res) => {
  const { userId, restaurantId, orderStatus } = req.body;

  const errors = validateFields(req.body, ["userId", "restaurantId", "orderStatus"], true);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    const billId = await billModel.createBill({
      userId,
      restaurantId,
      orderStatus,
    });

    return responseHandler.created(res, undefined, { billId });
  } catch (error) {
    console.error("Error creating bill:", error);
    return responseHandler.internalServerError(res);
  }
};

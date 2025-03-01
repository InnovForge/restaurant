import billModel from "../models/bill.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

export const createBill = async (req, res) => {
  const { userId, restaurantId, orderStatus, foodId, reservationId, quantity } = req.body;

  const errors = validateFields(
    req.body,
    ["userId", "restaurantId", "orderStatus", "foodId", "reservationId", "quantity"],
    true,
  );
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    const { success, billId, billItemId } = await billModel.createBill({
      user_id: userId,
      restaurant_id: restaurantId,
      order_status: orderStatus,
      food_id: foodId,
      reservation_id: reservationId,
      quantity,
    });

    if (success) {
      return responseHandler.created(res, undefined, { billId, billItemId });
    } else {
      return responseHandler.badRequest(res, "Failed to create bill");
    }
  } catch (error) {
    console.error("Error creating bill:", error);
    return responseHandler.internalServerError(res);
  }
};

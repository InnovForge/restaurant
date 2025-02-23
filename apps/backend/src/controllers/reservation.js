import reservationModel from "../models/reservation.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

export const createReservation = async (req, res) => {
  const { restaurant_id, user_id, table_number, reservation_status } = req.body;

  const errors = validateFields(req.body, ["restaurant_id", "user_id", "table_number", "reservation_status"], true);

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    const reservationId = await reservationModel.createReservation({
      restaurant_id,
      user_id,
      table_number,
      reservation_status,
    });

    return responseHandler.created(res, undefined, { reservationId });
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

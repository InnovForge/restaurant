import reservationModel from "../models/reservation.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

// export const createReservation = async (req, res) => {
//   const { restaurantId, userId, tableNumber, reservationStatus } = req.body;

//   const errors = validateFields(req.body, ["restaurant_id", "user_id", "table_number", "reservation_status"], true);

//   if (errors) {
//     return responseHandler.badRequest(res, undefined, errors);
//   }

//   try {
//     const reservationId = await reservationModel.createReservation({
//       restaurantId,
//       userId,
//       tableNumber,
//       reservationStatus,
//     });

//     return responseHandler.created(res, undefined, { reservationId });
//   } catch (error) {
//     console.log("error :>> ", error);
//     return responseHandler.internalServerError(res);
//   }
// };

export const createReservation = async (req, res) => {
  const formattedBody = {
    restaurant_id: req.body.restaurantId,
    user_id: req.body.userId,
    table_number: req.body.tableNumber,
    reservation_status: req.body.reservationStatus,
  };

  const errors = validateFields(
    formattedBody,
    ["restaurant_id", "user_id", "table_number", "reservation_status"],
    true,
  );

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    const reservation = await reservationModel.createReservation(formattedBody);

    return responseHandler.created(res, undefined, reservation);
  } catch (error) {
    console.log("Lỗi khi tạo đặt bàn: ", error);
    return responseHandler.internalServerError(res);
  }
};

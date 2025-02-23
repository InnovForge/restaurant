import reservationModel from "../models/reservation.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

export const createReservation = async (req, res) => {
    const { restaurantId,userId,table_number, reservation_status} = req.body;
    
    const errors = validateFields(req.body, ["restaurantId", "userId","table_number","reservation_status"], true);
    
    if (errors) {
        return responseHandler.badRequest(res, undefined, errors);
    }
    
    try {
        const reservationId = await reservationModel.createReservation({
        userId,
        restaurantId,
        table_number,
        reservation_status,
        });
    
        return responseHandler.created(res, undefined, { reservationId });
    } catch (error) {
        console.log("error :>> ", error);
        return responseHandler.internalServerError(res);
    }
}
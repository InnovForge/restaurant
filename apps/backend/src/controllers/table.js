import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";
import tableModel from "../models/table.js";

export const createTable = async (req, res) => {
  const { restaurantId } = req.params;
  const { tableName, tableNumber, seatCount } = req.body;

  const errors = validateFields(req.body, ["tableName", "tableNumber", "seatCount"], true);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    const { success, tableId } = await tableModel.createTable(restaurantId, {
      tableName,
      tableNumber,
      seatCount,
    });

    if (success) {
      return responseHandler.created(res, undefined, { tableId });
    } else {
      return responseHandler.badRequest(res, "Failed to create table");
    }
  } catch (error) {
    console.error("Error creating table:", error);
    return responseHandler.internalServerError(res);
  }
};

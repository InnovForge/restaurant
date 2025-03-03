import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";
import tableModel from "../models/table.js";

export const createTable = async (req, res) => {
  const { tableName, seatCount } = req.body;
  const { restaurantId } = req.params;

  const errors = validateFields(req.body, ["tableName", "seatCount"], true);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }
  try {
    const tableId = await tableModel.createTable(restaurantId, {
      tableName,
      seatCount,
    });
    return responseHandler.created(res, undefined, { tableId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return responseHandler.badRequest(
        res,
        undefined,
        [
          {
            field: "name",
            message: "Table already exists",
          },
        ],
        "ER_DUP_ENTRY",
      );
    }
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

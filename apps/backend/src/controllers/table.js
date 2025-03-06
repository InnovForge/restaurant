import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";
import tableModel from "../models/table.js";

export const createTables = async (req, res) => {
  const { tableName, seatCount } = req.body;
  const { restaurantId } = req.params;

  const errors = validateFields(req.body, ["tableName", "seatCount"], true);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }
  try {
    const tableId = await tableModel.createTables(restaurantId, {
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

export const getTables = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const tables = await tableModel.getTables(restaurantId);
    return responseHandler.success(res, tables);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

import foodModel from "../models/food.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { uploadFileFood } from "../utils/s3.js";
import { validateFields } from "../utils/validate-fields.js";

export const createFood = async (req, res) => {
  const { name, price, description } = req.body;
  const { restaurantId } = req.params;

  const errors = validateFields(req.body, ["name", "price", "description"], true);

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    const foodId = await foodModel.createFood(restaurantId, {
      name,
      price,
      description,
    });

    return responseHandler.created(res, undefined, { foodId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return responseHandler.badRequest(
        res,
        undefined,
        [
          {
            field: "name",
            message: "Username already exists",
          },
        ],
        "ER_DUP_ENTRY",
      );
    }
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const updateFood = async (req, res) => {
  const { restaurantId, foodId } = req.params;
  const { name, price, description } = req.body;
  const errors = validateFields(req.body, ["name", "price", "description"]);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    await foodModel.updateFood(restaurantId, foodId, {
      name,
      price,
      description,
    });

    return responseHandler.success(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const uploadFoodImage = async (req, res) => {
  const { foodId, restaurantId } = req.params;
  const file = req.file;

  try {
    console.log(foodId, restaurantId);
    const url = await uploadFileFood(`${restaurantId}/food/${foodId}/image`, file);
    console.log("url", url);
    const updatedStatus = await foodModel.updateFood(restaurantId, foodId, {
      image_url: url,
    });
    if (!updatedStatus) {
      return responseHandler.badRequest(res);
    }
    return responseHandler.created(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

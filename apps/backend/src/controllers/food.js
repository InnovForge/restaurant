import { cacheResponse } from "../middlewares/apiCache.js";
import foodModel from "../models/food.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { uploadFileFood } from "../utils/s3.js";
import { validateFields } from "../utils/validate-fields.js";
import * as foodService from "../services/food.js";

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
            message: "FoodsName already exists",
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
    // console.log(foodId, restaurantId);
    const url = await uploadFileFood(`${restaurantId}/food/${foodId}/image`, file);
    // console.log("url", url);
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

export const getFoods = async (req, res) => {
  const { latitude, longitude, radius, page = 1, pageSize = 15, filter = "popular" } = req.query;
  try {
    if (!latitude || !longitude) {
      return responseHandler.badRequest(res, ERROR_TYPE.INVALID_QUERY_PARAMS);
    }
    let foods;
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;
    switch (filter) {
      case "popular":
        foods = await foodService.getPopularFood(latitude, longitude, radius, limit, offset);
        break;
      case "nearby":
        foods = await foodService.getFoodNearby(latitude, longitude, radius, limit, offset);
        break;
      default:
        return responseHandler.badRequest(res, ERROR_TYPE.INVALID_QUERY_PARAMS);
    }
    cacheResponse(req.originalUrl, foods, 60 * 2);
    return responseHandler.success(res, undefined, foods);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const deleteFood = async (req, res) => {
  const { restaurantId, foodId } = req.params;
  try {
    const deleted = await foodModel.deleteFood(restaurantId, foodId);
    if (!deleted) {
      return responseHandler.badRequest(res);
    }
    return responseHandler.success(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

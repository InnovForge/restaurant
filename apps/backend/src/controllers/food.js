import { cacheResponse } from "../middlewares/apiCache.js";
import foodModel from "../models/food.js";
import { distance } from "../services/geocode.js";
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

export const getAllFood = async (req, res) => {
  const { latitude, longitude, radius } = req.query;
  if (!latitude || !longitude) {
    return responseHandler.badRequest(res, ERROR_TYPE.INVALID_QUERY_PARAMS);
  }
  try {
    const foods = await foodModel.getAllFood(latitude, longitude, radius);
    const updatedFoods = await Promise.all(
      foods.map(async (food) => {
        const waypoints = `${latitude},${longitude}|${food.latitude},${food.longitude}`;
        const distanceData = await distance(waypoints);

        const { estimated_distance, ...foodWithoutEstimate } = food;
        const data = {
          ...foodWithoutEstimate,
          distanceInfo: {
            straightLineDistance: estimated_distance,
            ...distanceData,
          },
        };
        return data;
      }),
    );
    cacheResponse(req.originalUrl, await updatedFoods, 60 * 2);
    return responseHandler.success(res, undefined, updatedFoods);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

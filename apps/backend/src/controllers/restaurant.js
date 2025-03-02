import { cacheResponse } from "../middlewares/apiCache.js";
import restaurantModel from "../models/restaurant.js";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";
import { uploadFileRestaurant } from "../utils/s3.js";
import { validateFields } from "../utils/validate-fields.js";
import * as restaurantService from "../services/restaurant.js";

export const updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const { name, phoneNumber, email } = req.body;
  const { address } = req.body;
  try {
    const fAddress = {
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      longitude: address.longitude,
      latitude: address.latitude,
    };

    await restaurantModel.updateRestaurant(restaurantId, {
      name,
      address: fAddress,
      phone_number: phoneNumber,
      email: email,
    });
    return responseHandler.success(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const createRestaurant = async (req, res) => {
  const { name, address, phoneNumber, email } = req.body;
  const userId = req.userId;

  const errors = validateFields(req.body, ["name", "address", "phoneNumber", "email"], true);

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  const emailExist = await restaurantModel.checkEmailExist(email);
  const phoneExist = await restaurantModel.checkPhoneExist(phoneNumber);
  if (phoneExist) {
    const errors = [];
    errors.push({ field: "phoneNumber", message: "Phone number already exists" });
    return responseHandler.badRequest(res, undefined, errors);
  }

  if (emailExist) {
    const errors = [];
    errors.push({ field: "email", message: "Email already exists" });
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    const restaurantId = await restaurantModel.createRestaurant(userId, {
      name,
      address,
      phoneNumber,
      email,
    });

    return responseHandler.created(res, undefined, { restaurantId });
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const uploadRestaurantImage = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { cover: coverFiles = [], logo: logoFiles = [] } = req.files || {};

    if (coverFiles.length === 0 && logoFiles.length === 0) {
      return responseHandler.badRequest(res, "no image uploaded");
    }

    const [coverUrl, logoUrl] = await Promise.all([
      coverFiles[0] ? uploadFileRestaurant(`${restaurantId}/cover`, coverFiles[0]) : null,
      logoFiles[0] ? uploadFileRestaurant(`${restaurantId}/logo`, logoFiles[0]) : null,
    ]);

    const updateData = {
      ...(coverUrl && { cover_url: coverUrl }),
      ...(logoUrl && { logo_url: logoUrl }),
    };

    if (Object.keys(updateData).length > 0) {
      await restaurantModel.updateRestaurant(restaurantId, updateData);
    }

    return responseHandler.success(res, "upload image success");
  } catch (error) {
    console.error("Error ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await restaurantModel.getRestaurant(restaurantId);
    return responseHandler.success(res, undefined, restaurant);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getRestaurantByUserId = async (req, res) => {
  const userId = req.userId;
  // console.log("userId :>> ", userId);
  try {
    const restaurant = await restaurantModel.getRestaurantByUserId(userId);
    return responseHandler.success(res, undefined, restaurant);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getAllFoodByResId = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const foods = await restaurantModel.GetAllFoodByResId(restaurantId);
    return responseHandler.success(res, undefined, foods);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getPopularRestaurants = async (req, res) => {
  const { latitude, longitude, radius, page = 1, pageSize = 10, filter = "popular" } = req.query;
  try {
    if (!latitude || !longitude) {
      return responseHandler.badRequest(res, ERROR_TYPE.INVALID_QUERY_PARAMS);
    }
    let restaurants;
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;
    switch (filter) {
      case "popular":
        restaurants = await restaurantService.getPopularFood(latitude, longitude, radius, limit, offset);
        break;
      default:
        return responseHandler.badRequest(res, ERROR_TYPE.INVALID_QUERY_PARAMS);
    }
    cacheResponse(req.originalUrl, restaurants, 60 * 2);
    return responseHandler.success(res, undefined, restaurants);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getFoodByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const foods = await restaurantModel.getFoodsByRestaurantId(restaurantId);
    return responseHandler.success(res, undefined, foods);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

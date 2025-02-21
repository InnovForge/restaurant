import restaurantModel from "../models/restaurant.js";
import responseHandler from "../utils/response.js";
import { uploadFileRestaurant } from "../utils/s3.js";
import { validateFields } from "../utils/validate-fields.js";

export const updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const { name, phoneNumber } = req.body;
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
    });
    return responseHandler.success(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const createRestaurant = async (req, res) => {
  const { name, address, phoneNumber } = req.body;

  const errors = validateFields(req.body, ["name", "address", "phoneNumber"], true);

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  const userId = req.userId;

  try {
    const restaurantId = await restaurantModel.createRestaurant(userId, {
      name,
      address,
      phoneNumber,
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
    const files = req.files || {};
    const coverUrl = files.coverUrl || [];
    const logoUrl = files.logoUrl || [];

    if (!coverUrl.length && !logoUrl.length) {
      return responseHandler.badRequest(res);
    }

    const object = {};

    if (coverUrl.length > 0) {
      object.cover_url = await uploadFileRestaurant(`${restaurantId}/cover`, coverUrl[0]);
    }
    if (logoUrl.length > 0) {
      object.logo_url = await uploadFileRestaurant(`${restaurantId}/logo`, logoUrl[0]);
    }

    if (object.length > 0) await restaurantModel.updateRestaurant(restaurantId, object);

    return responseHandler.success(res);
  } catch (error) {
    console.log("error :>> ", error);
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

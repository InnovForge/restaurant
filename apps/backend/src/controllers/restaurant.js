import restaurantModel from "../models/restaurant.js";
import responseHandler from "../utils/response.js";
import { uploadFileRestaurant } from "../utils/s3.js";
import { validateFields } from "../utils/validate-fields.js";

export const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber } = req.body;
  const { address } = req.body;
  try {
    const fAddress = {
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      longitude: address.longitude,
      latitude: address.latitude,
    };

    await restaurantModel.updateRestaurant(id, {
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

  const errors = validateFields({ name, address, phoneNumber });

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  const userId = req.userId;

  try {
    await restaurantModel.createRestaurant(userId, {
      name,
      address,
      phoneNumber,
    });

    return responseHandler.created(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const uploadRestaurantImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverUrl, logoUrl } = req.files;

    if (!coverUrl && !logoUrl) {
      return responseHandler.badRequest(res);
    }

    const object = {};

    if (coverUrl[0]) {
      object.cover_url = await uploadFileRestaurant(`${id}/cover`, coverUrl[0]);
    }
    if (logoUrl[0]) {
      object.logo_url = await uploadFileRestaurant(`${id}/logo`, logoUrl[0]);
    }

    await restaurantModel.updateRestaurant(id, object);

    return responseHandler.created(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

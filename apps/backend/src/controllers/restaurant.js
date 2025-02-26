import restaurantModel from "../models/restaurant.js";
import responseHandler from "../utils/response.js";
import { uploadFileRestaurant } from "../utils/s3.js";
import { validateFields } from "../utils/validate-fields.js";

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

  const errors = validateFields(req.body, ["name", "address", "phoneNumber", "email"], true);

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  const userId = req.userId;

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
      return responseHandler.badRequest(res, "Không có ảnh nào được tải lên.");
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

    return responseHandler.success(res, "Cập nhật ảnh thành công.");
  } catch (error) {
    console.error("Lỗi upload ảnh nhà hàng: ", error);
    return responseHandler.internalServerError(res, "Có lỗi xảy ra khi tải ảnh lên.");
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

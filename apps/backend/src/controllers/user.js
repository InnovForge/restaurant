import userModel from "../models/user.js";
import responseHandler from "../utils/response.js";
import { uploadFileUser } from "../utils/s3.js";

export const updateUser = async (req, res) => {
  const id = req.userId;
  const { name, gender, email, username, password, phoneNumber, role } = req.body;
  try {
    const updatedStatus = await userModel.updateUser(id, {
      name,
      gender,
      email,
      username,
      password,
      role,
      phone_number: phoneNumber,
    });
    if (!updatedStatus) {
      return responseHandler.badRequest(res);
    }
    return responseHandler.success(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const updateUserAvatar = async (req, res) => {
  const id = req.userId;
  const file = req.file;
  try {
    const url = await uploadFileUser(`${id}/avatar`, file);
    console.log("url", url);
    const updatedStatus = await userModel.updateUser(id, { avatar_url: url });
    if (!updatedStatus) {
      return responseHandler.badRequest(res);
    }
    return responseHandler.created(res);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getUserFromToken = async (req, res) => {
  const id = req.userId;
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      return responseHandler.badRequest(res);
    }
    return responseHandler.success(res, undefined, user);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      return responseHandler.badRequest(res);
    }
    return responseHandler.success(res, undefined, user);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getUserName = async (req, res) => {
  const { name } = req.params;
  try {
    const user = await userModel.getUserByUsername(name);
    if (!user) {
      return responseHandler.badRequest(res);
    }
    return responseHandler.success(res, undefined, user);
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const getBillsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const bills = await userModel.getBillsByUserId(userId);
    if (bills.length === 0) {
      return responseHandler.notFound(res, "No bills found for this user.");
    }
    return responseHandler.success(res, "Bills retrieved successfully", bills);
  } catch (error) {
    console.error("Error:", error);
    return responseHandler.internalServerError(res);
  }
};

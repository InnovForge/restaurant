import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import { createNewAccessToken, createSesionLogin } from "../utils/jwt.js";
import responseHandler from "../utils/response.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return responseHandler.badRequest(res, "Bad request, invalid input");
  }

  const user = await userModel.getUserByUsername(username);
  if (!user) {
    return responseHandler.unauthorized(res, "Unauthorized, invalid username or password");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return responseHandler.unauthorized(res, "Unauthorized, invalid username or password");
  }
  createSesionLogin(res, user.user_id);
  return responseHandler.success(res, "Login successfully");
};

export const refreshToken = async (req, res) => {
  // console.log("refreshToken", req.cookies);
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return responseHandler.unauthorized(res, "Unauthorized");
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
    if (err) {
      return responseHandler.unauthorized(res, "unauthorized");
    }
    createNewAccessToken(res, user.userId);
    return responseHandler.created(res, "New access token created");
  });
};

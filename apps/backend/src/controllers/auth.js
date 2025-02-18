import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import { createNewAccessToken, createSesionLogin } from "../utils/jwt.js";
import responseHandler from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  const errors = validateFields(req.body, ["username", "password"], true);
  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
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
  return responseHandler.success(res);
};

export const register = async (req, res) => {
  const { username, password, name } = req.body;

  const errors = validateFields(req.body, ["username", "password", "name"], true);

  if (errors) {
    return responseHandler.badRequest(res, undefined, errors);
  }

  try {
    await userModel.createUser({
      username,
      password,
      name,
    });

    responseHandler.created(res);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return responseHandler.badRequest(
        res,
        undefined,
        [
          {
            field: "username",
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

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return responseHandler.unauthorized(res);
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
      if (err) {
        return responseHandler.unauthorized(res, undefined, "TOKEN_EXPIRED");
      }
      createNewAccessToken(res, user.userId);
      return responseHandler.created(res);
    });
  } catch (error) {
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  return responseHandler.success(res);
};

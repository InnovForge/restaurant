import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import { createNewAccessToken, createSesionLogin } from "../utils/jwt.js";
import responseHandler from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  const errors = validateFields({ username, password });
  if (errors) {
    return responseHandler.badRequest(res, "Bad request, invalid input", errors);
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

export const register = async (req, res) => {
  const { username, password, name } = req.body;

  const errors = validateFields({ username, password, name });

  if (errors) {
    return responseHandler.badRequest(res, "Bad request, invalid input", errors);
  }

  try {
    await userModel.createUser({
      username,
      password,
      name,
    });

    responseHandler.created(res, "User created successfully");
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return responseHandler.badRequest(res, "ER_DUP_ENTRY", [
        {
          field: "username",
          message: "Username already exists",
        },
      ]);
    }
    console.log("error :>> ", error);
    return responseHandler.internalServerError(res, "Internal server error", error);
  }
};

export const refreshToken = async (req, res) => {
  try {
    // console.log("refreshToken", req.cookies);
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return responseHandler.unauthorized(res, "Unauthorized");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
      if (err) {
        return responseHandler.unauthorized(res, "Unauthorized");
      }
      createNewAccessToken(res, user.userId);
      return responseHandler.created(res, "New access token created");
    });
  } catch (error) {
    return responseHandler.internalServerError(res, "Internal server error");
  }
};

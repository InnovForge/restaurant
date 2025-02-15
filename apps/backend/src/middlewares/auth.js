import jwt from "jsonwebtoken";
import responseHandler, { ERROR_TYPE } from "../utils/response.js";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;
  // console.log(req.cookies);
  if (!token) {
    return responseHandler.unauthorized(res, undefined, "AUTH_ERROR");
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return responseHandler.unauthorized(res, undefined, "REFRESH_TOKEN_EXPIRED");
    }
    req.userId = decoded.userId;
    next();
  });
};

export { authenticateJWT };

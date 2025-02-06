import jwt from "jsonwebtoken";
import responseHandler from "../utils/response.js";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;
  console.log(req.cookies);
  if (!token) {
    return responseHandler.unauthorized(res, "Unauthorized");
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
    if (err) {
      return responseHandler.unauthorized(res, "refresh token expired", "ACCESS_TOKEN_EXPIRED");
    }
    req.user = user; // Gán user vào request
    next();
  });
};

export { authenticateJWT };

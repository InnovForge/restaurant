import jwt from "jsonwebtoken";
import responseHandler from "../utils/response.js";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;
  // console.log(req.cookies);
  if (!token) {
    return responseHandler.unauthorized(res);
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return responseHandler.unauthorized(res, "Refresh token expired", "ACCESS_TOKEN_EXPIRED");
    }
    req.userId = decoded.userId; // Gán user vào request
    next();
  });
};

export { authenticateJWT };

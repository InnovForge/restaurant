import restaurantModel from "../models/restaurant.js";
import responseHandler from "../utils/response.js";

const ROLE = {
  owner: "owner",
  manager: "manager",
  staff: "staff",
};

const authRestaurant =
  (allowedRoles = []) =>
  async (req, res, next) => {
    const userId = req.userId;
    const restaurantId = req.params.id;

    try {
      const role = await restaurantModel.getUserRestaurantRole(userId, restaurantId);

      if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
        return responseHandler.forbidden(res);
      }

      next();
    } catch (err) {
      return responseHandler.internalServerError(res, err.message);
    }
  };

export { authRestaurant, ROLE };

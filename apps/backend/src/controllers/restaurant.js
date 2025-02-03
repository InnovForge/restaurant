import restaurantModel from "../models/restaurant.js";
import * as response from "../utils/response.js";

export const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, location, image } = req.body;
  try {
    const restaurant = await restaurantModel.updateRestaurant(id, {
      name,
      address,
      phone,
      location,
      image,
    });
    return response.success(res, "Restaurant updated", restaurant);
  } catch (error) {
    return response.internalServerError(res, error.message);
  }
};

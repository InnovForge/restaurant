import restaurantModel from "../models/restaurant.js";
import { distance } from "./geocode.js";

const getPopularRestaurant = async (latitude, longitude, radius, limit, offset) => {
  const restaurants = await restaurantModel.getPopularRestaurants(latitude, longitude, radius, limit, offset);
  const updatedRestaurants = await Promise.all(
    restaurants.map(async (restaurant) => {
      const waypoints = `${latitude},${longitude}|${restaurant.latitude},${restaurant.longitude}`;
      const distanceData = await distance(waypoints);
      const { estimated_distance, ...restaurantWithoutEstimate } = restaurant;
      const data = {
        ...restaurantWithoutEstimate,
        distanceInfo: {
          straightLineDistance: estimated_distance,
          ...distanceData,
        },
      };
      return data;
    }),
  );

  return updatedRestaurants;
};

export { getPopularRestaurant as getPopularFood };

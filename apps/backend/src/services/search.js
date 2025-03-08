import foodModel from "../models/food.js";
import restaurantModel from "../models/restaurant.js";
import { distance } from "./geocode.js";

const searchFoodNearby = async (latitude, longitude, radius, limit, offset, searchTerm) => {
  const foods = await foodModel.searchFoodNearby(latitude, longitude, radius, limit, offset, searchTerm);
  const updatedFoods = await Promise.all(
    foods.map(async (food) => {
      const waypoints = `${latitude},${longitude}|${food.latitude},${food.longitude}`;
      const distanceData = await distance(waypoints);
      const { estimated_distance, ...foodWithoutEstimate } = food;
      const data = {
        ...foodWithoutEstimate,
        distanceInfo: {
          straightLineDistance: estimated_distance,
          ...distanceData,
        },
      };
      return data;
    }),
  );
  return updatedFoods;
};

const searchRestaurantNearby = async (latitude, longitude, radius, limit, offset, query) => {
  const restaurants = await restaurantModel.searchRestaurantsNearby(latitude, longitude, radius, limit, offset, query);
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
export { searchFoodNearby, searchRestaurantNearby };

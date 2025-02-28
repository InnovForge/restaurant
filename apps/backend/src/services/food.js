import foodModel from "../models/food.js";
import { distance } from "./geocode.js";

const getPopularFood = async (latitude, longitude, radius, limit, offset) => {
  const foods = await foodModel.getPopularFoods(latitude, longitude, radius, limit, offset);

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

const getFoodNearby = async (latitude, longitude, radius, limit, offset) => {
  const foods = await foodModel.getFoodNearby(latitude, longitude, radius, limit, offset);
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
export { getPopularFood, getFoodNearby };

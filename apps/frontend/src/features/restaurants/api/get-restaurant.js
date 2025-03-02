import { api } from "@/lib/api-client";

export const getRestaurant = async (restaurantId) => {
  return api.get(`/v1/restaurants/${restaurantId}`);
};

export const getFoodsByRestaurantId = async (restaurantId) => {
  return api.get(`/v1/restaurants/${restaurantId}/foods/t`);
};

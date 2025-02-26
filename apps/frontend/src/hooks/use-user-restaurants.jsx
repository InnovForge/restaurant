import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import useUserRestaurantsStore from "@/stores/useUserRestaurantsStore";

const fetchUserRestaurants = async () => {
  const response = await api.get("/v1/restaurants/mine");
  return response.data;
};

export const useUserRestaurants = () => {
  const { setRestaurants, restaurants } = useUserRestaurantsStore();

  const queryResult = useQuery({
    queryKey: ["restaurants-mine"],
    queryFn: async () => {
      const restaurants = await fetchUserRestaurants();
      if (restaurants.data) {
        setRestaurants(restaurants.data);
        return restaurants.data;
      }
      return null;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: restaurants.length === 0,
  });

  return { ...queryResult, restaurants };
};

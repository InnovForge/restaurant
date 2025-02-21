import { createContext, useContext } from "react";
import { useParams } from "react-router";

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const { restaurantId } = useParams();

  return <RestaurantContext.Provider value={{ restaurantId }}>{children}</RestaurantContext.Provider>;
};

export const useRestaurant = () => useContext(RestaurantContext);

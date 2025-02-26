import { create } from "zustand";

const useUserRestaurantsStore = create((set) => ({
  restaurants: [],
  setRestaurants: (data) => set({ restaurants: data }),
}));

export default useUserRestaurantsStore;

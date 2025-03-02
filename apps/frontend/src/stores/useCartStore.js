import { create } from "zustand";

const useCartStore = create((set) => ({
  Cart: [],

  addCart: (newItem) =>
    set((state) => {
      const existingItem = state.Cart.find((item) => item.foodId === newItem.foodId);
      if (existingItem) {
        return {
          Cart: state.Cart.map((item) =>
            item.foodId === newItem.foodId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      } else {
        return {
          Cart: [{ ...newItem, quantity: 1 }, ...state.Cart],
        };
      }
    }),
}));

export default useCartStore;

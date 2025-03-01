import { create } from "zustand";

const useCartStore = create((set) => ({
  Cart: [],
  addCart: (newAddCart) =>
    set((state) => ({
      Cart: [newAddCart, ...state.Cart],
    })),
}));

export default useCartStore;

import { create } from "zustand";

const useCartStore = create((set) => ({
  Cart: [],

  //   addCart: (newItem) =>
  //     set((state) => {
  //       const existingItem = state.Cart.find((item) => item.foodId === newItem.foodId);
  //       if (existingItem) {
  //         return {
  //           Cart: state.Cart.map((item) =>
  //             item.foodId === newItem.foodId ? { ...item, quantity: item.quantity + 1 } : item,
  //           ),
  //         };
  //       } else {
  //         return {
  //           Cart: [{ ...newItem, quantity: 1 }, ...state.Cart],
  //         };
  //       }
  //     }),
  addCart: (newItem) =>
    set((state) => {
      // Nếu giỏ hàng trống, thêm món mới luôn
      if (state.Cart.length === 0) {
        return { Cart: [{ ...newItem, quantity: 1 }] };
      }

      // Kiểm tra xem có món nào trong giỏ khác nhà hàng không
      const firstItem = state.Cart[0]; // Lấy món đầu tiên trong giỏ

      if (firstItem.restaurantId !== newItem.restaurantId) {
        const confirmReset = window.confirm("Bạn có muốn đặt lại giỏ hàng khi chọn món từ nhà hàng khác?");
        if (!confirmReset) return state; // Nếu từ chối, giữ nguyên giỏ hàng
        return { Cart: [{ ...newItem, quantity: 1 }] }; // Reset giỏ hàng
      }

      // Nếu cùng nhà hàng, kiểm tra xem món đã tồn tại chưa
      const existingItem = state.Cart.find((item) => item.foodId === newItem.foodId);
      if (existingItem) {
        console.log("existingItem", existingItem);
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
  removeCart: (foodId) =>
    set((state) => ({
      Cart: state.Cart.map((item) => (item.foodId === foodId ? { ...item, quantity: item.quantity - 1 } : item)).filter(
        (item) => item.quantity > 0,
      ), // Xóa nếu số lượng về 0
    })),
}));

export default useCartStore;

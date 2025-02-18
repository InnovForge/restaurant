import { create } from "zustand";

const useAuthUserStore = create((set) => ({
  authUser: null, // Ban đầu là một đối tượng trống
  setAuthUser: (data) => set({ authUser: data }), // Hàm cập nhật thông tin người dùng
}));

export default useAuthUserStore;

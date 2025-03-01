import { create } from "zustand";

const useAuthUserStore = create((set) => ({
  authUser: null,
  setAuthUser: (data) => set({ authUser: data }),
}));

export default useAuthUserStore;

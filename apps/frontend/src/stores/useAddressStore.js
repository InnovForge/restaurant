import { create } from "zustand";

const useAddressStore = create((set) => ({
  addresses: [],
  setAddress: (newAddress) =>
    set((state) => ({
      addresses: [newAddress, ...state.addresses],
    })),
  updateAddress: (id, updatedData) =>
    set((state) => ({
      addresses: state.addresses.map((address) => (address.id === id ? { ...address, ...updatedData } : address)),
    })),
  removeAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.filter((address) => address.id !== id),
    })),
  clearAddresses: () => set({ addresses: [] }),
}));

export default useAddressStore;

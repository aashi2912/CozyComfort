import { create } from "zustand";

interface CartStore {
  cart: any[] | null;
  loading: boolean;
  setLoading: (value: boolean) => void;
  updateCart: (updatedCart: []) => void;
  resetCart: () => void;
}

const useCartStore = create<CartStore>(
  (set) => ({
    cart: [],
    loading: false,
    setLoading: (value: boolean) => set({ loading: value }),
    updateCart: (updatedCart: []) => set({ cart: updatedCart }),
    resetCart: () => set({ cart: null }),
  }),
);

export default useCartStore;

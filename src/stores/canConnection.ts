import { create } from 'zustand';

interface CanConnectionStore {
  connected: boolean;
  setConnected: (state: boolean) => void
}

export const useCanConnectionStore = create<CanConnectionStore>((set, _get) => ({
  connected: false,
  setConnected: (connected: boolean) => {
    set({ connected });
  },
}));

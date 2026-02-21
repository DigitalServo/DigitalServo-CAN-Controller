import { create } from 'zustand';

interface UserStore {
  user: string | null;
  setUser: (User: string) => void
}

export const useUserStore = create<UserStore>((set, _get) => ({
  user: null,
  setUser: (user: string) => {
    set({ user });
  },
}));

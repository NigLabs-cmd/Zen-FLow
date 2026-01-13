import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  isDarkMode: true,
  setUser: (user) => set({ user }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
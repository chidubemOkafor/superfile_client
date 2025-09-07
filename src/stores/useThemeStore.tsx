import { create } from "zustand";

interface iThemeStore {
    theme: "light" | "dark",
    setTheme: (value: "light" | "dark") => void
}

export const useThemeStore = create<iThemeStore>((set) => ({
    theme: "dark",
    setTheme: (value) => set({ theme: value})
}))
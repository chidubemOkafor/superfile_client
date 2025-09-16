import { create } from "zustand";

interface IuseToggleActive {
    active: string | null,
    setActive: (value: string) => void
}

export const useToggleActive = create<IuseToggleActive>((set) => ({
    active: null,
    setActive: (value) => set({ active: value})

}))

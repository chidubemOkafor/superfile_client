import { create } from "zustand";

interface IuseToggleSideBar {
  isToggled: boolean;
  setIsToggled: () => void;
}

const useToggleSideBar = create<IuseToggleSideBar>((set) => ({
  isToggled: false,
  setIsToggled: () => set((state) => ({ isToggled: !state.isToggled })),
}));

export default useToggleSideBar;

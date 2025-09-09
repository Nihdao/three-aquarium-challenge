import { create } from "zustand";

export const useControlsStore = create((set) => ({
  // Controls states
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  moveUp: false,
  moveDown: false,
  swimFast: false,

  // Actions to modify the states
  setMoveForward: (value) => set({ moveForward: value }),
  setMoveBackward: (value) => set({ moveBackward: value }),
  setMoveLeft: (value) => set({ moveLeft: value }),
  setMoveRight: (value) => set({ moveRight: value }),
  setMoveUp: (value) => set({ moveUp: value }),
  setMoveDown: (value) => set({ moveDown: value }),
  setSwimFast: (value) => set({ swimFast: value }),

  // Generic action for touch controls
  setControl: (controlName, value) => set({ [controlName]: value }),
}));

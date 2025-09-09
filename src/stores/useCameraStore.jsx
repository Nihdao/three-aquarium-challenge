import { create } from "zustand";

export const useCameraStore = create((set) => ({
  cameraMode: "orbit", // "third-person" or "orbit"
  setCameraMode: (mode) => set({ cameraMode: mode }),
}));

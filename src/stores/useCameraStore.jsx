import { create } from "zustand";

export const useCameraStore = create((set) => ({
  cameraMode: "third-person", // "third-person" ou "orbit"
  setCameraMode: (mode) => set({ cameraMode: mode }),
}));

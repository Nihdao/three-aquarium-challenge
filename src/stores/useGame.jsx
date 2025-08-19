import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      blocksCount: 10,
      startTime: 0,
      endTime: 0,
      blockSeed: 0,

      phase: "ready",
      start: () => {
        set((state) => {
          if (state.phase === "ready")
            return { phase: "playing", startTime: Date.now() };

          return {};
        });
      },
      restart: () => {
        set((state) => {
          if (state.phase === "ended" || state.phase === "playing")
            return { phase: "ready", blockSeed: Math.random() };

          return {};
        });
      },
      end: () => {
        set((state) => {
          if (state.phase === "playing")
            return { phase: "ended", endTime: Date.now() };

          return {};
        });
      },
    };
  })
);

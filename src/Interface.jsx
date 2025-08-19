import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame.jsx";
import { useRef, useEffect } from "react";
import { addEffect } from "@react-three/fiber";

export function Interface() {
  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);
  const timeRef = useRef();
  const forward = useKeyboardControls((state) => state.moveForward);
  const backward = useKeyboardControls((state) => state.moveBackward);
  const leftward = useKeyboardControls((state) => state.moveLeft);
  const rightward = useKeyboardControls((state) => state.moveRight);
  const jump = useKeyboardControls((state) => state.jump);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }
      if (timeRef.current) {
        timeRef.current.textContent = (elapsedTime / 1000).toFixed(2);
      }
    });

    return () => {
      unsubscribeEffect();
    };
  }, [phase]);

  return (
    <div className="interface">
      {/* Time */}
      <div className="time" ref={timeRef}>
        0.00
      </div>

      {/* Restart */}
      {phase === "ended" && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${rightward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
}

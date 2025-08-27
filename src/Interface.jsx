import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useControlsStore } from "./stores/useControlsStore.jsx";

export function Interface() {
  const [isMobile, setIsMobile] = useState(false);

  // États des contrôles depuis le store
  const {
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    setControl,
  } = useControlsStore();

  // Handlers pour les contrôles tactiles
  const handleTouchStart = (action) => {
    setControl(action, true);
  };

  const handleTouchEnd = (action) => {
    setControl(action, false);
  };

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="interface">
      {/* Fish Controls Legend - Desktop */}
      {!isMobile && (
        <div className="fish-controls-legend">
          <div className="legend-title">Navigation</div>
          <div className="legend-item">
            <span className="key-hint">WASD / Arrows</span>
            <span className="action">Move</span>
          </div>
          <div className="legend-item">
            <span className="key-hint">Space / C</span>
            <span className="action">Up / Down</span>
          </div>
        </div>
      )}

      {/* Mobile Touch Controls */}
      {isMobile && (
        <div className="mobile-controls">
          <div className="direction-pad">
            <button
              className={`control-btn up ${moveForward ? "active" : ""}`}
              onTouchStart={() => handleTouchStart("moveForward")}
              onTouchEnd={() => handleTouchEnd("moveForward")}
              onMouseDown={() => handleTouchStart("moveForward")}
              onMouseUp={() => handleTouchEnd("moveForward")}
              onMouseLeave={() => handleTouchEnd("moveForward")}
            >
              ↑
            </button>
            <div className="middle-row">
              <button
                className={`control-btn left ${moveLeft ? "active" : ""}`}
                onTouchStart={() => handleTouchStart("moveLeft")}
                onTouchEnd={() => handleTouchEnd("moveLeft")}
                onMouseDown={() => handleTouchStart("moveLeft")}
                onMouseUp={() => handleTouchEnd("moveLeft")}
                onMouseLeave={() => handleTouchEnd("moveLeft")}
              >
                ←
              </button>
              <button
                className={`control-btn down ${moveBackward ? "active" : ""}`}
                onTouchStart={() => handleTouchStart("moveBackward")}
                onTouchEnd={() => handleTouchEnd("moveBackward")}
                onMouseDown={() => handleTouchStart("moveBackward")}
                onMouseUp={() => handleTouchEnd("moveBackward")}
                onMouseLeave={() => handleTouchEnd("moveBackward")}
              >
                ↓
              </button>
              <button
                className={`control-btn right ${moveRight ? "active" : ""}`}
                onTouchStart={() => handleTouchStart("moveRight")}
                onTouchEnd={() => handleTouchEnd("moveRight")}
                onMouseDown={() => handleTouchStart("moveRight")}
                onMouseUp={() => handleTouchEnd("moveRight")}
                onMouseLeave={() => handleTouchEnd("moveRight")}
              >
                →
              </button>
            </div>
          </div>
          <div className="vertical-controls">
            <button
              className={`control-btn swim-up ${moveUp ? "active" : ""}`}
              onTouchStart={() => handleTouchStart("moveUp")}
              onTouchEnd={() => handleTouchEnd("moveUp")}
              onMouseDown={() => handleTouchStart("moveUp")}
              onMouseUp={() => handleTouchEnd("moveUp")}
              onMouseLeave={() => handleTouchEnd("moveUp")}
            >
              ↗
            </button>
            <button
              className={`control-btn swim-down ${moveDown ? "active" : ""}`}
              onTouchStart={() => handleTouchStart("moveDown")}
              onTouchEnd={() => handleTouchEnd("moveDown")}
              onMouseDown={() => handleTouchStart("moveDown")}
              onMouseUp={() => handleTouchEnd("moveDown")}
              onMouseLeave={() => handleTouchEnd("moveDown")}
            >
              ↘
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

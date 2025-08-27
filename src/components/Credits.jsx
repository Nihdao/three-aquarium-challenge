import { useState } from "react";

export function Credits() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Bouton pour ouvrir les crédits */}
      <button
        className="credits-button"
        onClick={() => setIsVisible(true)}
        title="Credits"
      >
        INFO
      </button>

      {/* Modal des crédits */}
      {isVisible && (
        <div className="credits-overlay" onClick={() => setIsVisible(false)}>
          <div className="credits-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="credits-close"
              onClick={() => setIsVisible(false)}
            >
              ✕
            </button>

            <div className="credits-content">
              <h2 className="credits-title">🐠 Aquarium In and Out</h2>

              <div className="credits-section">
                <h3>🎓 Created for</h3>
                <p>
                  <strong>Bruno Simon's 19th ThreejsJourney Challenge</strong>
                  <br />
                  Theme: Aquarium
                </p>
              </div>

              <div className="credits-section">
                <h3>🎨 3D Assets</h3>
                <p>
                  <strong>Quaternius</strong>
                  <br />
                  Fish models
                  <br />
                  <a
                    href="https://quaternius.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    quaternius.com
                  </a>
                </p>
                <p>Others aquarium assets by me!</p>
              </div>

              <div className="credits-section">
                <h3>🛠️ Built with</h3>
                <ul>
                  <li>
                    <strong>React Three Fiber / Three.js</strong> - 3D rendering
                  </li>
                  <li>
                    <strong>React Three Drei</strong> - utilities
                  </li>
                  <li>
                    <strong>React Three Rapier</strong> - physics
                  </li>
                  <li>
                    <strong>Zustand</strong> - state management
                  </li>
                  <li>
                    <strong>Leva</strong> - debug controls
                  </li>
                  <li>
                    <strong>Vite</strong> - build tool
                  </li>
                </ul>
              </div>

              <div className="credits-section">
                <h3>🌊 Features</h3>
                <ul>
                  <li>Immersive fish POV camera</li>
                  <li>Physics-based swimming</li>
                  <li>AI fish with behavioral patterns</li>
                  <li>Water wave post-processing effects</li>
                  <li>Responsive touch controls</li>
                </ul>
              </div>

              <div className="credits-footer">
                <p>Big kudos for the Three.js community</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

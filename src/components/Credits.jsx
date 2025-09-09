import { useState } from "react";

export function Credits() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Button to open credits */}
      <button
        className="credits-button"
        onClick={() => setIsVisible(true)}
        title="Credits"
      >
        INFO
      </button>

      {/* Credits modal */}
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
                  <strong>Bruno Simon's 19th Three.js Journey Challenge</strong>
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
                <p>
                  Others aquarium assets by me! <br />
                  For the fish tank I have followed{" "}
                  <a
                    href="https://www.youtube.com/watch?v=rCDLsCOgu_E"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    this tutorial
                  </a>
                </p>
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
                  <li>
                    Water surface with waves (thanks to Dan Greenheck's{" "}
                    <a
                      href="https://github.com/dgreenheck/threejs-water-shader"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      threejs-water-shader
                    </a>
                    )
                  </li>
                </ul>
              </div>

              <div className="credits-section">
                <h3>🛠️ Debug Mode</h3>
                <p>
                  Add <strong>#debug</strong> to the URL to access performance
                  and physics collider debug.
                </p>
              </div>

              <div className="credits-section">
                <h3>👨‍💻 Author</h3>
                <p>
                  <strong>Adam Alet</strong>
                  <br />
                  <a
                    href="https://x.com/nihdao"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @nihdao
                  </a>
                </p>
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

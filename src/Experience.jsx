import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Player from "./Player.jsx";
import FishTank from "./FishTank.jsx";
import { Physics } from "@react-three/rapier";
import useGame from "./stores/useGame.jsx";
import { useCameraStore } from "./stores/useCameraStore.jsx";
import { Perf } from "r3f-perf";
import { useControls } from "leva";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function Experience() {
  const { cameraMode, setCameraMode } = useCameraStore();
  const { camera } = useThree();

  // Position par défaut pour la caméra orbit
  const defaultOrbitPosition = [37.43, 101.23, 148.68];
  const defaultOrbitTarget = [0, 25, 0];

  // Repositionner la caméra quand on passe en mode orbit
  useEffect(() => {
    if (cameraMode === "orbit") {
      camera.position.set(...defaultOrbitPosition);
      camera.lookAt(...defaultOrbitTarget);
    }
  }, [cameraMode, camera]);

  // Contrôles Leva pour switcher entre les modes caméraz
  useControls("Point of View", {
    POV: {
      value: cameraMode,
      options: {
        Fish: "third-person",
        Contemplation: "orbit",
      },
      onChange: (value) => setCameraMode(value),
    },
  });

  return (
    <>
      <Perf position="top-left" />

      <color attach="background" args={["#120118"]} />

      {/* OrbitControls pour le mode contemplation */}
      {cameraMode === "orbit" && (
        <OrbitControls
          position={[37.43, 101.23, 148.68]}
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={100}
          maxDistance={300}
          target={defaultOrbitTarget}
        />
      )}

      <Physics gravity={[0, -1, 0]}>
        <Lights />

        <FishTank />
        <Player />
      </Physics>
    </>
  );
}

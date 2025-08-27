import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Player from "./Player.jsx";
import FishTank from "./FishTank.jsx";
import NPCFish from "./NPCFish.jsx";
import { Physics } from "@react-three/rapier";
import useGame from "./stores/useGame.jsx";
import { useCameraStore } from "./stores/useCameraStore.jsx";
import { Perf } from "r3f-perf";
import { useControls } from "leva";
import { EffectComposer } from "@react-three/postprocessing";
import { WaterWaveEffect } from "./effects/WaterWaveEffect.jsx";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

export default function Experience() {
  const { cameraMode, setCameraMode } = useCameraStore();

  // Contrôles pour l'effet d'ondulation
  const { waveStrength, enableWaves, blueIntensity, waterColor } = useControls(
    "Water Effects",
    {
      enableWaves: true,
      waveStrength: { value: 1.2, min: 0, max: 2, step: 0.1 },
      blueIntensity: { value: 0.4, min: 0, max: 1, step: 0.05 },
      waterColor: { value: "#a9cbff" },
    }
  );
  const { camera } = useThree();

  // Position par défaut pour la caméra orbit
  const defaultOrbitPosition = [50, 120.23, 200.68];
  const defaultOrbitTarget = [0, 75, 0];

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
      {/* Contrôles pour l'environnement */}

      <Environment preset="lobby" blur={0.4} background />

      <color attach="background" args={["#FFC312"]} />

      {/* OrbitControls pour le mode contemplation */}
      {cameraMode === "orbit" && (
        <OrbitControls
          position={[37.43, 101.23, 200]}
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={100}
          maxDistance={300}
          target={defaultOrbitTarget}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
        />
      )}

      <Physics gravity={[0, -1, 0]}>
        <Lights />
        <FishTank />
        <Player />

        {/* NPCs Fish */}
        <NPCFish
          fishType="./assets/Goldfish.glb"
          position={[60, 75, 10]}
          pattern="circular"
          scale={2.5}
          speed={0.8}
        />
        <NPCFish
          fishType="./assets/ButterflyFish.glb"
          position={[-40, 100, 20]}
          pattern="figure8"
          scale={2}
          speed={1.2}
        />
      </Physics>

      {/* Post-processing avec effet d'ondulation uniquement en mode poisson */}
      {cameraMode === "third-person" && enableWaves && (
        <EffectComposer>
          <WaterWaveEffect
            strength={waveStrength}
            blueIntensity={blueIntensity}
            waterColor={[
              parseInt(waterColor.slice(1, 3), 16) / 255,
              parseInt(waterColor.slice(3, 5), 16) / 255,
              parseInt(waterColor.slice(5, 7), 16) / 255,
            ]}
          />
        </EffectComposer>
      )}
    </>
  );
}

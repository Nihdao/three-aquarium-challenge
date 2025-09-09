import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Player from "./Player.jsx";
import FishTank from "./FishTank.jsx";
import NPCFish from "./NPCFish.jsx";
import Water from "./Water.jsx";
import { Physics } from "@react-three/rapier";
import useGame from "./stores/useGame.jsx";
import { useCameraStore } from "./stores/useCameraStore.jsx";
import { Perf } from "r3f-perf";
import { EffectComposer } from "@react-three/postprocessing";
import { WaterWaveEffect } from "./effects/WaterWaveEffect.jsx";
import { DebugControls } from "./components/DebugControls.jsx";
import { useDebugMode } from "./hooks/useDebugMode.jsx";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

export default function Experience() {
  const { cameraMode } = useCameraStore();
  const isDebugMode = useDebugMode();

  // Use of the centralized DebugControls component
  const { waterEffects, waterSurface, aquarium } = DebugControls();
  const { enableWaves, waveStrength, waterColorIntensity, waterColor } =
    waterEffects;

  const { camera } = useThree();

  // Default position for the orbit camera
  const defaultOrbitPosition = [50, 120.23, 200.68];
  const defaultOrbitTarget = [0, 75, 0];

  // Reposition the camera when changing mode
  useEffect(() => {
    if (cameraMode === "orbit") {
      camera.position.set(...defaultOrbitPosition);
      camera.lookAt(...defaultOrbitTarget);
    } else if (cameraMode === "third-person") {
      // Initial position closer to the fish
      camera.position.set(0, 80, -15);
      camera.lookAt(0, 75, 0);
    }
  }, [cameraMode, camera]);

  return (
    <>
      {/* Display Perf only in debug mode */}
      {isDebugMode && <Perf position="bottom-right" />}
      {/* Controls for the environment */}

      <Environment preset="lobby" blur={0.4} background />

      <color attach="background" args={["#FFC312"]} />

      {/* OrbitControls for the contemplation mode */}
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

      <Physics gravity={[0, -1, 0]} debug={isDebugMode}>
        <Lights />
        <FishTank glassOpacity={aquarium.glassOpacity} />
        <Player stabilizationStrength={0.2} enableStabilization={true} />

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

        {/* Water surface */}
        <Water
          position={waterSurface.position}
          sizeX={waterSurface.sizeX}
          sizeZ={waterSurface.sizeZ}
          segments={512}
          {...waterSurface}
          // Conversion of hex colors to array RGB
          peakColor={[
            parseInt(waterSurface.peakColor.slice(1, 3), 16) / 255,
            parseInt(waterSurface.peakColor.slice(3, 5), 16) / 255,
            parseInt(waterSurface.peakColor.slice(5, 7), 16) / 255,
          ]}
        />
      </Physics>

      {/* Post-processing with wave effect only in fish mode */}
      {cameraMode === "third-person" && enableWaves && (
        <EffectComposer>
          <WaterWaveEffect
            strength={waveStrength}
            waterColorIntensity={waterColorIntensity}
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

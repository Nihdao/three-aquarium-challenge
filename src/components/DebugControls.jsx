import { useControls, folder } from "leva";
import { useCameraStore } from "../stores/useCameraStore.jsx";
import { useDebugMode } from "../hooks/useDebugMode.jsx";

export function DebugControls() {
  const { cameraMode, setCameraMode } = useCameraStore();
  const isDebugMode = useDebugMode();

  // Controls for the wave effect
  const waterEffects = useControls(
    "Water Effects (Fish POV)",
    {
      enableWaves: true,
      waveStrength: { value: 1.2, min: 0, max: 2, step: 0.1 },
      waterColorIntensity: { value: 0.4, min: 0, max: 1, step: 0.05 },
      waterColor: { value: "#a9cbff" },
    },
    { collapsed: !isDebugMode }
  );

  // Controls for the camera
  useControls("Camera", {
    viewMode: {
      value: cameraMode,
      options: {
        "🐠 Fish POV": "third-person",
        "👁️ Free Camera": "orbit",
      },
      onChange: (value) => setCameraMode(value),
    },
  });

  // Controls for the water surface
  const waterSurface = useControls(
    "Water Surface",
    {
      // Size parameters
      sizeX: { value: 159, min: 50, max: 800, step: 10 },
      sizeZ: { value: 59, min: 50, max: 800, step: 10 },
      position: { value: [8, 125, 18], min: -1000, max: 1000, step: 10 },

      // Wave parameters
      wavesAmplitude: { value: 1.4, min: 0, max: 10, step: 0.1 },
      wavesSpeed: { value: 0.2, min: 0, max: 3, step: 0.1 },
      wavesFrequency: { value: 0.02, min: 0.001, max: 0.1, step: 0.001 },
      wavesPersistence: { value: 0.3, min: 0, max: 1, step: 0.05 },
      wavesLacunarity: { value: 2.0, min: 1, max: 5, step: 0.1 },
      wavesIterations: { value: 3.0, min: 1, max: 8, step: 1 },

      // Colors
      peakColor: { value: "#e1f6fc" },

      // Fresnel
      fresnelScale: { value: 0.5, min: 0, max: 2, step: 0.05 },
      fresnelPower: { value: 2.0, min: 0.5, max: 5, step: 0.1 },

      // General
      opacity: { value: 0.4, min: 0, max: 1, step: 0.05 },
    },
    { collapsed: !isDebugMode }
  );

  // Controls for the aquarium
  const aquarium = useControls(
    "Aquarium",
    {
      glassOpacity: { value: 1, min: 0, max: 1, step: 0.05 },
    },
    { collapsed: !isDebugMode }
  );

  // Return the values so Experience can use them
  return {
    waterEffects,
    waterSurface,
    aquarium,
  };
}

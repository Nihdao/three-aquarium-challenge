import { useControls, folder } from "leva";
import { useCameraStore } from "../stores/useCameraStore.jsx";

export function DebugControls() {
  const { cameraMode, setCameraMode } = useCameraStore();

  // Contrôles pour l'effet d'ondulation
  const waterEffects = useControls("Water Effects (Fish POV)", {
    enableWaves: true,
    waveStrength: { value: 1.2, min: 0, max: 2, step: 0.1 },
    waterColorIntensity: { value: 0.4, min: 0, max: 1, step: 0.05 },
    waterColor: { value: "#a9cbff" },
  });

  // Contrôles pour la caméra
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

  // Retourner les valeurs pour que Experience puisse les utiliser
  return {
    waterEffects,
  };
}

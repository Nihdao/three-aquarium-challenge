import { useState } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { useCameraStore } from "../stores/useCameraStore.jsx";

export function usePlayerCamera() {
  const { cameraMode } = useCameraStore();
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const moveDownV = 0.3;
  const moveUpV = -0.3;
  const moveDownT = 2;
  const moveUpT = 2;

  const updateCamera = (state, bodyPosition, fishQuaternion, keys) => {
    // Ne mettre à jour la caméra que si on est en mode third-person
    if (cameraMode !== "third-person") return;

    const { moveUp, moveDown } = keys;

    // Calculate camera tilt based on vertical movement
    const tiltAngle = moveUp ? moveUpV : moveDown ? moveDownV : 0;
    const tiltQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(tiltAngle, 0, 0)
    );

    // Calculate camera offset based on player rotation and tilt
    const cameraOffset = new THREE.Vector3(0, 2.65 * 3, -10.25 * 3);
    // Appliquer d'abord le tilt dans l'espace local, puis la rotation du poisson
    cameraOffset
      .applyQuaternion(tiltQuaternion)
      .applyQuaternion(fishQuaternion);

    // Set camera position relative to player position and rotation
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition).add(cameraOffset);

    // Set camera target to look at player with vertical offset
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += moveUp ? moveUpT : moveDown ? moveDownT : 0.25;

    // Smooth camera movement
    smoothedCameraPosition.lerp(cameraPosition, 0.05);
    smoothedCameraTarget.lerp(cameraTarget, 0.05);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  };

  return {
    updateCamera,
  };
}

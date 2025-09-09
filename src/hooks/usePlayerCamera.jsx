import { useState } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { useCameraStore } from "../stores/useCameraStore.jsx";

export function usePlayerCamera() {
  const { cameraMode } = useCameraStore();
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(0, 80, -20)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3(0, 75, 0));

  const moveDownV = 0.3;
  const moveUpV = -0.3;
  const moveDownT = 2;
  const moveUpT = 2;

  const updateCamera = (state, bodyPosition, fishQuaternion, keys) => {
    // Update the camera only if we are in third-person mode
    if (cameraMode !== "third-person") return;

    const { moveUp, moveDown } = keys;

    // Calculate camera tilt based on vertical movement
    const tiltAngle = moveUp ? moveUpV : moveDown ? moveDownV : 0;
    const tiltQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(tiltAngle, 0, 0)
    );

    // Calculate camera offset based on player rotation and tilt
    const cameraOffset = new THREE.Vector3(0, 2.65 * 3, -10.25 * 3);
    // Apply the tilt in the local space first, then the fish rotation
    cameraOffset
      .applyQuaternion(tiltQuaternion)
      .applyQuaternion(fishQuaternion);

    // Set the camera position relative to the player position and rotation
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition).add(cameraOffset);

    // Set the camera target to look at the player with a vertical offset
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += moveUp ? moveUpT : moveDown ? moveDownT : 0.25;

    // Smooth the camera movement
    smoothedCameraPosition.lerp(cameraPosition, 0.15);
    smoothedCameraTarget.lerp(cameraTarget, 0.15);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  };

  return {
    updateCamera,
  };
}

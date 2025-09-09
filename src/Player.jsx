import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAnimations } from "@react-three/drei";
import { RigidBody, useRapier, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom hooks
import { usePlayerAttack } from "./hooks/usePlayerAttack";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { usePlayerCamera } from "./hooks/usePlayerCamera";
import { usePlayerAnimations } from "./hooks/usePlayerAnimations";
import { useHybridControls } from "./hooks/useHybridControls";

// Components
import AttackHitbox from "./components/AttackHitbox";
// import DebugMarker from "./components/DebugMarker";

export default function Player({
  stabilizationStrength = 0.05,
  enableStabilization = true,
}) {
  const playerFish = useGLTF("./assets/MandarinFish.glb");
  const animations = useAnimations(playerFish.animations, playerFish.scene);
  const controls = useHybridControls();
  const player = useRef();
  const { rapier, world } = useRapier();

  // Custom hooks
  const { isAttacking, executeAttack } = usePlayerAttack(animations);
  const { updateCamera } = usePlayerCamera();
  const { updateAnimations } = usePlayerAnimations(animations, isAttacking);
  const { calculateMovement, applyMovement } = usePlayerMovement(
    player,
    isAttacking
  );
  // DoubleSide to make the model visible from the inside and the outside
  useEffect(() => {
    // Traverse all the children of the model to apply doubleSide to the materials
    playerFish.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // If it's an array of materials
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            material.side = 2; // THREE.DoubleSide
          });
        } else {
          // If it's a single material
          child.material.side = 2; // THREE.DoubleSide
        }
      }
    });
  }, [playerFish.scene]);

  // Management of the movement and the game logic
  useFrame((state, delta) => {
    if (!player.current) return;

    // Recovery of the hybrid controls (keyboard + touch)
    const keys = controls;

    // Management of the attack
    if (keys.action) {
      executeAttack();
    }

    // Management of the animations
    updateAnimations(keys);

    // Calculation of the quaternion of the fish
    const bodyRotation = player.current.rotation();
    const fishQuaternion = new THREE.Quaternion(
      bodyRotation.x,
      bodyRotation.y,
      bodyRotation.z,
      bodyRotation.w
    );

    // Calculation and application of the movement
    const { velocity, angularVelocity } = calculateMovement(
      keys,
      fishQuaternion
    );
    applyMovement(velocity, angularVelocity);

    // System of stabilization to avoid the displacement
    if (enableStabilization) {
      const currentRotation = player.current.rotation();

      // Create a target quaternion that keeps only the Y rotation (direction)
      const targetQuaternion = new THREE.Quaternion();
      const euler = new THREE.Euler();
      euler.setFromQuaternion(fishQuaternion, "YXZ");

      // Keep only the Y rotation, reset X and Z progressively
      const targetEuler = new THREE.Euler(
        THREE.MathUtils.lerp(euler.x, 0, stabilizationStrength * 2), // Redress X
        euler.y, // Keep the Y direction
        THREE.MathUtils.lerp(euler.z, 0, stabilizationStrength * 2), // Redress Z
        "YXZ"
      );

      targetQuaternion.setFromEuler(targetEuler);

      // Apply the redressing only if the fish is not moving fast
      const isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.z) > 0.1;
      if (!isMoving || !isAttacking) {
        // Interpolate towards the target rotation
        const currentQuat = new THREE.Quaternion(
          currentRotation.x,
          currentRotation.y,
          currentRotation.z,
          currentRotation.w
        );

        currentQuat.slerp(targetQuaternion, stabilizationStrength);
        player.current.setRotation(currentQuat, true);
      }
    }

    // Update of the camera
    const bodyPosition = player.current.translation();
    updateCamera(state, bodyPosition, fishQuaternion, keys);
  });

  return (
    <>
      <RigidBody
        ref={player}
        position={[0, 100, 20]}
        mass={1}
        colliders={false}
      >
        <CuboidCollider args={[1.5, 1.5, 6]} position={[0, 0, -2]} />
        <primitive object={playerFish.scene} scale={3} position={[0, 0, 0]} />

        {/* Attack hitbox */}
        <AttackHitbox isAttacking={isAttacking} />
      </RigidBody>

      {/* Debug marker for the position */}
      {/* <DebugMarker /> */}
    </>
  );
}

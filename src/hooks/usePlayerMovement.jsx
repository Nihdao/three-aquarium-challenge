import * as THREE from "three";

export function usePlayerMovement(player, isAttacking) {
  const swimStrength = 20.0;
  const turnStrength = 2.0;
  const floatStrength = 10.0;

  const calculateMovement = (keys, fishQuaternion) => {
    const { moveForward, moveBackward, moveLeft, moveRight, moveDown, moveUp } =
      keys;

    const velocity = new THREE.Vector3(0, 0, 0);
    const angularVelocity = { x: 0, y: 0, z: 0 };

    if (isAttacking) {
      return { velocity, angularVelocity };
    }

    if (moveForward) {
      // Movement forward in the local direction of the fish
      const forwardDirection = new THREE.Vector3(0, 0, swimStrength);
      forwardDirection.applyQuaternion(fishQuaternion);
      velocity.add(forwardDirection);
    }
    if (moveBackward) {
      // Movement backward in the local direction of the fish
      const backwardDirection = new THREE.Vector3(0, 0, -swimStrength);
      backwardDirection.applyQuaternion(fishQuaternion);
      velocity.add(backwardDirection);
    }
    if (moveLeft) {
      // Rotation on the Y axis to turn left
      angularVelocity.y += turnStrength;
    }
    if (moveRight) {
      // Rotation on the Y axis to turn right
      angularVelocity.y -= turnStrength;
    }
    if (moveUp) {
      // Movement up (always in the world Y axis)
      velocity.y += floatStrength;
    }
    if (moveDown) {
      // Movement down (always in the world Y axis)
      velocity.y -= floatStrength;
    }

    return { velocity, angularVelocity };
  };

  const applyMovement = (velocity, angularVelocity) => {
    if (!player.current) return;

    player.current.setLinvel(
      { x: velocity.x, y: velocity.y, z: velocity.z },
      true
    );
    player.current.setAngvel(angularVelocity, true);
  };

  return {
    calculateMovement,
    applyMovement,
  };
}

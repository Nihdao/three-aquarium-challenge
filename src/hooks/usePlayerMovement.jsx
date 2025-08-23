import * as THREE from "three";

export function usePlayerMovement(player, isAttacking) {
  const swimStrength = 10.0;
  const turnStrength = 2.0;
  const floatStrength = 3.0;

  const calculateMovement = (keys, fishQuaternion) => {
    const { moveForward, moveBackward, moveLeft, moveRight, moveDown, moveUp } =
      keys;

    const velocity = new THREE.Vector3(0, 0, 0);
    const angularVelocity = { x: 0, y: 0, z: 0 };

    if (isAttacking) {
      return { velocity, angularVelocity };
    }

    if (moveForward) {
      // Mouvement vers l'avant dans la direction locale du poisson
      const forwardDirection = new THREE.Vector3(0, 0, swimStrength);
      forwardDirection.applyQuaternion(fishQuaternion);
      velocity.add(forwardDirection);
    }
    if (moveBackward) {
      // Mouvement vers l'arrière dans la direction locale du poisson
      const backwardDirection = new THREE.Vector3(0, 0, -swimStrength);
      backwardDirection.applyQuaternion(fishQuaternion);
      velocity.add(backwardDirection);
    }
    if (moveLeft) {
      // Rotation sur l'axe Y pour tourner à gauche
      angularVelocity.y += turnStrength;
    }
    if (moveRight) {
      // Rotation sur l'axe Y pour tourner à droite
      angularVelocity.y -= turnStrength;
    }
    if (moveUp) {
      // Mouvement vers le haut (toujours dans l'axe monde Y)
      velocity.y += floatStrength;
    }
    if (moveDown) {
      // Mouvement vers le bas (toujours dans l'axe monde Y)
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

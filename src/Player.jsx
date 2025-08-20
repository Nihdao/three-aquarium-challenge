import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useAnimations } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, useRapier, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Player() {
  const playerFish = useGLTF("./assets/MandarinFish.glb");
  const animations = useAnimations(playerFish.animations, playerFish.scene);
  const [subscribedKeys, getKeys] = useKeyboardControls();
  const player = useRef();
  const { rapier, world } = useRapier();
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(false);
  console.log(animations);

  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());
  const { moveDownV, moveUpV, moveDownT, moveUpT } = useControls({
    moveDownV: {
      value: 0.3,
      step: 0.1,
    },
    moveUpV: {
      value: -0.3,
      step: 0.1,
    },
    moveDownT: {
      value: 1.2,
      step: 0.1,
    },
    moveUpT: {
      value: 1.2,
      step: 0.1,
    },
  });
  // DoubleSide pour que le modèle soit visible de l'intérieur et de l'extérieur
  useEffect(() => {
    // Parcourir tous les enfants du modèle pour appliquer doubleSide aux matériaux
    playerFish.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Si c'est un tableau de matériaux
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            material.side = 2; // THREE.DoubleSide
          });
        } else {
          // Si c'est un seul matériau
          child.material.side = 2; // THREE.DoubleSide
        }
      }
    });
  }, [playerFish.scene]);

  // Gestion du mouvement
  useFrame((state, delta) => {
    if (!player.current) return;

    // Controls
    const {
      moveForward,
      moveBackward,
      moveLeft,
      moveRight,
      moveDown,
      moveUp,
      action,
      swimFast,
    } = getKeys();

    // Gestion de l'attaque
    if (action && !isAttacking && !attackCooldown) {
      setIsAttacking(true);
      setAttackCooldown(true);

      // Lancer l'animation d'attaque
      const attackAction = animations.actions["Fish_Armature|Attack"];
      if (attackAction) {
        // Arrêter les autres animations
        Object.values(animations.actions).forEach((anim) => anim.fadeOut(0.1));
        attackAction.reset().fadeIn(0.1).play();
        attackAction.setLoop(THREE.LoopOnce);
        attackAction.clampWhenFinished = true;

        // Finir l'attaque après la durée de l'animation
        setTimeout(() => {
          setIsAttacking(false);
          attackAction.fadeOut(0.3);
        }, 800); // Durée de l'animation d'attaque

        // Cooldown de l'attaque
        setTimeout(() => {
          setAttackCooldown(false);
        }, 1200); // Cooldown total
      }
    }

    // Gestion des animations basée sur le mouvement (seulement si pas en train d'attaquer)
    if (!isAttacking) {
      const isMoving = moveForward || moveBackward;
      const targetAnimation = isMoving
        ? "Fish_Armature|Swimming_Fast"
        : "Fish_Armature|Swimming_Normal";

      const currentAction = animations.actions[targetAnimation];
      if (currentAction && !currentAction.isRunning()) {
        currentAction.reset().fadeIn(0.3).play();
        // Arrêter l'autre animation
        const otherAnimation = isMoving
          ? "Fish_Armature|Swimming_Normal"
          : "Fish_Armature|Swimming_Fast";
        if (
          animations.actions[otherAnimation] &&
          animations.actions[otherAnimation].isRunning()
        ) {
          animations.actions[otherAnimation].fadeOut(0.3);
        }
      }
    }

    // Récupérer la rotation actuelle pour calculer les directions dans l'espace monde
    const bodyRotation = player.current.rotation();
    const fishQuaternion = new THREE.Quaternion(
      bodyRotation.x,
      bodyRotation.y,
      bodyRotation.z,
      bodyRotation.w
    );

    const velocity = new THREE.Vector3(0, 0, 0);
    const angularVelocity = { x: 0, y: 0, z: 0 };

    const swimStrength = 5.0;
    const turnStrength = 2.0;
    const floatStrength = 3.0;
    const tiltStrength = 0.8;

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

    // Application de la vélocité pour un mouvement fluide de poisson
    player.current.setLinvel(
      { x: velocity.x, y: velocity.y, z: velocity.z },
      true
    );
    player.current.setAngvel(angularVelocity, true);

    // Camera
    const bodyPosition = player.current.translation();
    // Réutiliser bodyRotation et fishQuaternion déjà calculés

    // Calculate camera tilt based on vertical movement
    const tiltAngle = moveUp ? moveUpV : moveDown ? moveDownV : 0;
    const tiltQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(tiltAngle, 0, 0)
    );

    // Calculate camera offset based on player rotation and tilt
    const cameraOffset = new THREE.Vector3(0, 2.65, -8.25);
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
    smoothedCameraPosition.lerp(cameraPosition, 0.1);
    smoothedCameraTarget.lerp(cameraTarget, 0.1);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // // Phases
    // if (bodyPosition.z < -(blocksCount + 0.5) * 4) {
    //   console.log("end");
    //   end();
    // }
    // if (bodyPosition.y < -4) {
    //   restart();
    // }
  });

  return (
    <>
      <RigidBody ref={player} position={[0, 0, 0]} mass={1} colliders={false}>
        <CuboidCollider args={[1, 0.8, 1]} position={[0, 0, 0]} />
        <primitive object={playerFish.scene} scale={1} position={[0, 0, 0]} />

        {/* Hitbox d'attaque temporaire - visible seulement pendant l'attaque */}
        {isAttacking && (
          <mesh position={[0, 0, 2]} visible={true}>
            <boxGeometry args={[1.5, 1.5, 1]} />
            <meshBasicMaterial
              color="red"
              transparent={true}
              opacity={0.5}
              wireframe={true}
            />
          </mesh>
        )}
      </RigidBody>

      {/* Marqueur de debug pour la position */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.5, 5, 0.5]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </>
  );
}

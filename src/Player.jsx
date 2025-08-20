import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAnimations } from "@react-three/drei";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, useRapier, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Hooks personnalisés
import { usePlayerAttack } from "./hooks/usePlayerAttack";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { usePlayerCamera } from "./hooks/usePlayerCamera";
import { usePlayerAnimations } from "./hooks/usePlayerAnimations";

// Composants
import AttackHitbox from "./components/AttackHitbox";
import DebugMarker from "./components/DebugMarker";

export default function Player() {
  const playerFish = useGLTF("./assets/MandarinFish.glb");
  const animations = useAnimations(playerFish.animations, playerFish.scene);
  const [subscribedKeys, getKeys] = useKeyboardControls();
  const player = useRef();
  const { rapier, world } = useRapier();

  // Hooks personnalisés
  const { isAttacking, executeAttack } = usePlayerAttack(animations);
  const { updateCamera } = usePlayerCamera();
  const { updateAnimations } = usePlayerAnimations(animations, isAttacking);
  const { calculateMovement, applyMovement } = usePlayerMovement(
    player,
    isAttacking
  );
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

  // Gestion du mouvement et de la logique de jeu
  useFrame((state, delta) => {
    if (!player.current) return;

    // Récupération des contrôles
    const keys = getKeys();

    // Gestion de l'attaque
    if (keys.action) {
      executeAttack();
    }

    // Gestion des animations
    updateAnimations(keys);

    // Calcul du quaternion de rotation du poisson
    const bodyRotation = player.current.rotation();
    const fishQuaternion = new THREE.Quaternion(
      bodyRotation.x,
      bodyRotation.y,
      bodyRotation.z,
      bodyRotation.w
    );

    // Calcul et application du mouvement
    const { velocity, angularVelocity } = calculateMovement(
      keys,
      fishQuaternion
    );
    applyMovement(velocity, angularVelocity);

    // Mise à jour de la caméra
    const bodyPosition = player.current.translation();
    updateCamera(state, bodyPosition, fishQuaternion, keys);
  });

  return (
    <>
      <RigidBody ref={player} position={[0, 0, 0]} mass={1} colliders={false}>
        <CuboidCollider args={[1, 0.8, 1]} position={[0, 0, 0]} />
        <primitive object={playerFish.scene} scale={1} position={[0, 0, 0]} />

        {/* Hitbox d'attaque */}
        <AttackHitbox isAttacking={isAttacking} />
      </RigidBody>

      {/* Marqueur de debug pour la position */}
      <DebugMarker />
    </>
  );
}

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAnimations } from "@react-three/drei";
import { RigidBody, useRapier, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Hooks personnalisés
import { usePlayerAttack } from "./hooks/usePlayerAttack";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { usePlayerCamera } from "./hooks/usePlayerCamera";
import { usePlayerAnimations } from "./hooks/usePlayerAnimations";
import { useHybridControls } from "./hooks/useHybridControls";

// Composants
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

    // Récupération des contrôles hybrides (clavier + tactile)
    const keys = controls;

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

    // Système de stabilisation pour éviter le désaxement
    if (enableStabilization) {
      const currentRotation = player.current.rotation();

      // Créer un quaternion cible qui garde seulement la rotation Y (direction)
      const targetQuaternion = new THREE.Quaternion();
      const euler = new THREE.Euler();
      euler.setFromQuaternion(fishQuaternion, "YXZ");

      // Garder seulement la rotation Y, reset X et Z progressivement
      const targetEuler = new THREE.Euler(
        THREE.MathUtils.lerp(euler.x, 0, stabilizationStrength * 2), // Redresser X
        euler.y, // Garder la direction Y
        THREE.MathUtils.lerp(euler.z, 0, stabilizationStrength * 2), // Redresser Z
        "YXZ"
      );

      targetQuaternion.setFromEuler(targetEuler);

      // Appliquer le redressement seulement si le poisson n'est pas en mouvement rapide
      const isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.z) > 0.1;
      if (!isMoving || !isAttacking) {
        // Interpoler vers la rotation cible
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

    // Mise à jour de la caméra
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
        <CuboidCollider args={[1, 0.8, 1]} position={[0, 0, 0]} />
        <primitive object={playerFish.scene} scale={3} position={[0, 0, 0]} />

        {/* Hitbox d'attaque */}
        <AttackHitbox isAttacking={isAttacking} />
      </RigidBody>

      {/* Marqueur de debug pour la position */}
      {/* <DebugMarker /> */}
    </>
  );
}

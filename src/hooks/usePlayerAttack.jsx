import { useState } from "react";
import * as THREE from "three";

export function usePlayerAttack(animations) {
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(false);

  const executeAttack = () => {
    if (isAttacking || attackCooldown) return false;

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
      }, 400); // Durée de l'animation d'attaque

      // Cooldown de l'attaque
      setTimeout(() => {
        setAttackCooldown(false);
      }, 1200); // Cooldown total
    }

    return true;
  };

  return {
    isAttacking,
    attackCooldown,
    executeAttack,
  };
}

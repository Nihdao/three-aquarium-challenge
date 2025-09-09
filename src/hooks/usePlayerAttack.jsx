import { useState } from "react";
import * as THREE from "three";

export function usePlayerAttack(animations) {
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(false);

  const executeAttack = () => {
    if (isAttacking || attackCooldown) return false;

    setIsAttacking(true);
    setAttackCooldown(true);

    // Launch the attack animation
    const attackAction = animations.actions["Fish_Armature|Attack"];
    if (attackAction) {
      // Stop the other animations
      Object.values(animations.actions).forEach((anim) => anim.fadeOut(0.1));
      attackAction.reset().fadeIn(0.1).play();
      attackAction.setLoop(THREE.LoopOnce);
      attackAction.clampWhenFinished = true;

      // Finish the attack after the animation duration
      setTimeout(() => {
        setIsAttacking(false);
        attackAction.fadeOut(0.3);
      }, 400); // Attack animation duration

      // Attack cooldown
      setTimeout(() => {
        setAttackCooldown(false);
      }, 800); // Total cooldown
    }

    return true;
  };

  return {
    isAttacking,
    attackCooldown,
    executeAttack,
  };
}

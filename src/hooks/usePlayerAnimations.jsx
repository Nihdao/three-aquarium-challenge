export function usePlayerAnimations(animations, isAttacking) {
  const updateAnimations = (keys) => {
    // Animation management based on movement (only if not attacking)
    if (!isAttacking) {
      const { moveForward, moveBackward } = keys;
      const isMoving = moveForward || moveBackward;
      const targetAnimation = isMoving
        ? "Fish_Armature|Swimming_Fast"
        : "Fish_Armature|Swimming_Normal";

      const currentAction = animations.actions[targetAnimation];
      if (currentAction && !currentAction.isRunning()) {
        currentAction.reset().fadeIn(0.3).play();
        // Stop the other animation
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
  };

  return {
    updateAnimations,
  };
}

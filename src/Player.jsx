import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useAnimations } from "@react-three/drei";
import { useControls } from "leva";

export default function Player() {
  const playerFish = useGLTF("./assets/MandarinFish.glb");
  const animations = useAnimations(playerFish.animations, playerFish.scene);
  console.log(animations);

  const { animationName } = useControls({
    animationName: {
      value: "Fish_Armature|Swimming_Normal",
      options: animations.names,
    },
  });

  // Gestion des animations
  useEffect(() => {
    const action = animations.actions[animationName];
    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [animationName]);

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

  return <primitive object={playerFish.scene} scale={1} position={[0, 0, 0]} />;
}

import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";

export default function FishTank() {
  const fishTank = useGLTF("./assets/FishTank.glb");

  // Configuration des matériaux pour la transparence du verre si nécessaire
  useEffect(() => {
    fishTank.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Si le mesh contient "glass" ou "verre" dans son nom, on le rend transparent
        if (
          child.name.toLowerCase().includes("glass") ||
          child.name.toLowerCase().includes("verre") ||
          child.name.toLowerCase().includes("vitre")
        ) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              material.transparent = true;
              material.opacity = 0.8;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = 0.8;
          }
        }
      }
    });
  }, [fishTank.scene]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={fishTank.scene} scale={200} position={[0, -10, 0]} />
    </RigidBody>
  );
}

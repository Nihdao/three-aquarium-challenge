import { useGLTF, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function FishTank({ glassOpacity = 0.15 }) {
  const { nodes } = useGLTF("./assets/FishTankv4.glb");
  const fishTank_glass = useGLTF("./assets/FishTankv5_ft.glb");
  const texture = useTexture("./assets/baked4.jpg");
  texture.flipY = false;

  const lightTopMaterial = useMemo(() => {
    return <meshBasicMaterial color="#ff0000" />;
  }, []);

  // Modify the properties of the existing material rather than replacing it
  useEffect(() => {
    if (fishTank_glass.nodes.FishTank) {
      fishTank_glass.nodes.FishTank.traverse((child) => {
        if (child.isMesh && child.material) {
          // Preserve the original material but adjust the transparency properties
          const originalMaterial = child.material;

          // If it's an array of materials
          if (Array.isArray(originalMaterial)) {
            originalMaterial.forEach((material) => {
              material.transparent = true;
              material.opacity = glassOpacity;
              material.side = THREE.DoubleSide;
              material.depthWrite = false;
              material.needsUpdate = true;
            });
          } else {
            // If it's a single material
            originalMaterial.transparent = true;
            originalMaterial.opacity = glassOpacity;
            originalMaterial.side = THREE.DoubleSide;
            originalMaterial.depthWrite = false;
            originalMaterial.needsUpdate = true;
          }

          child.renderOrder = 1; // Render after the opaque objects
        }
      });
    }
  }, [fishTank_glass, glassOpacity]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group scale={1}>
        <mesh
          geometry={nodes.mergedBaked.geometry}
          position={nodes.mergedBaked.position}
        >
          <meshBasicMaterial map={texture} />
        </mesh>

        <primitive object={fishTank_glass.nodes.FishTank} />
      </group>
    </RigidBody>
  );
}

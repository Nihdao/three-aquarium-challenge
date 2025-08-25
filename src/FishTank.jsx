import { useGLTF, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function FishTank() {
  const { nodes } = useGLTF("./assets/FishTankv4.glb");
  const fishTank_glass = useGLTF("./assets/FishTankv4_ft.glb");
  const texture = useTexture("./assets/baked4.jpg");
  texture.flipY = false;

  const lightTopMaterial = useMemo(() => {
    return <meshBasicMaterial color="#ff0000" />;
  }, []);

  const fishTankMaterial = useMemo(() => {
    return <meshLambertMaterial color="#FFFFFF" opacity={0.2} transparent />;
  }, []);

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

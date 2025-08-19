import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Lights() {
  const directionalLightRef = useRef();

  useFrame((state) => {
    directionalLightRef.current.position.z = state.camera.position.z + 1 - 4;
    directionalLightRef.current.target.position.z = state.camera.position.z - 4;
    directionalLightRef.current.target.updateMatrixWorld();
  });

  return (
    <>
      <directionalLight
        castShadow
        ref={directionalLightRef}
        position={[4, 4, 1]}
        intensity={4.5}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-top={20}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={1.5} />
    </>
  );
}

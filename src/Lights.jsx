import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default function Lights() {
  const directionalLightRef = useRef();
  const rectLightRef = useRef();
  const helperRef = useRef();

  // Initialize the uniforms for RectAreaLight
  RectAreaLightUniformsLib.init();

  // Create the helper when the light is up
  useEffect(() => {
    if (rectLightRef.current && helperRef.current) {
      const helper = new RectAreaLightHelper(rectLightRef.current);
      helperRef.current.add(helper);

      return () => {
        helperRef.current?.remove(helper);
      };
    }
  }, []);

  //   useFrame((state) => {
  //     directionalLightRef.current.position.z = state.camera.position.z + 1 - 4;
  //     directionalLightRef.current.target.position.z = state.camera.position.z - 4;
  //     directionalLightRef.current.target.updateMatrixWorld();
  //   });

  return (
    <>
      {/* <directionalLight
        castShadow
        ref={directionalLightRef}
        position={[4, 4, 1]}
        intensity={10.5}
      /> */}
      <ambientLight intensity={2.5} color="#ffffff" />

      {/* RectAreaLight violet directed towards the bottom */}
      {/* <rectAreaLight
        ref={rectLightRef}
        color="#fdf8ff"
        intensity={50}
        width={100}
        height={10}
        position={[0, 76.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      /> */}

      {/* Helper to visualize the RectAreaLight */}
      <group ref={helperRef} />
    </>
  );
}

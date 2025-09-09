import { useRef, useMemo } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import vertexShader from "./shaders/waves/vertex.glsl?raw";
import fragmentShader from "./shaders/waves/fragment.glsl?raw";

// Extension of the custom material
extend({ ShaderMaterial: THREE.ShaderMaterial });

export default function Water({
  // Parameters of position and size
  position = [0, 125, -50],
  sizeX = 160,
  sizeZ = 50,
  segments = 512,

  // Parameters of the waves (controlled by Leva)
  wavesAmplitude = 2.0,
  wavesSpeed = 0.5,
  wavesFrequency = 0.02,
  wavesPersistence = 0.5,
  wavesLacunarity = 2.0,
  wavesIterations = 3.0,

  // Parameters of the color (controlled by Leva)
  troughColor = [0.1, 0.3, 0.5],
  surfaceColor = [0.2, 0.5, 0.8],
  peakColor = [0.4, 0.7, 1.0],

  // Parameters of the transition (controlled by Leva)
  peakThreshold = 1.0,
  peakTransition = 0.5,
  troughThreshold = -1.0,
  troughTransition = 0.5,

  // Parameters Fresnel (controlled by Leva)
  fresnelScale = 0.5,
  fresnelPower = 2.0,

  // General parameters
  opacity = 0.8,
}) {
  const meshRef = useRef();
  const { scene } = useThree();

  // Creation of the plane geometry
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(sizeX, sizeZ, segments, segments);
  }, [sizeX, sizeZ, segments]);

  // Uniforms for the shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },

      // Parameters of the waves
      uWavesAmplitude: { value: wavesAmplitude },
      uWavesSpeed: { value: wavesSpeed },
      uWavesFrequency: { value: wavesFrequency },
      uWavesPersistence: { value: wavesPersistence },
      uWavesLacunarity: { value: wavesLacunarity },
      uWavesIterations: { value: wavesIterations },

      // Parameters of the color
      uTroughColor: { value: new THREE.Vector3(...troughColor) },
      uSurfaceColor: { value: new THREE.Vector3(...surfaceColor) },
      uPeakColor: { value: new THREE.Vector3(...peakColor) },

      // Parameters of the transition
      uPeakThreshold: { value: peakThreshold },
      uPeakTransition: { value: peakTransition },
      uTroughThreshold: { value: troughThreshold },
      uTroughTransition: { value: troughTransition },

      // Parameters Fresnel
      uFresnelScale: { value: fresnelScale },
      uFresnelPower: { value: fresnelPower },

      // Environment map (will be defined later)
      uEnvironmentMap: { value: null },

      // Opacity
      uOpacity: { value: opacity },
    }),
    [
      wavesAmplitude,
      wavesSpeed,
      wavesFrequency,
      wavesPersistence,
      wavesLacunarity,
      wavesIterations,
      troughColor,
      surfaceColor,
      peakColor,
      peakThreshold,
      peakTransition,
      troughThreshold,
      troughTransition,
      fresnelScale,
      fresnelPower,
      opacity,
    ]
  );

  // Creation of the shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [uniforms]);

  // Update of the uniforms in real time
  useFrame((state) => {
    if (material.uniforms) {
      material.uniforms.uTime.value = state.clock.elapsedTime;

      // Update of the parameters of the waves
      material.uniforms.uWavesAmplitude.value = wavesAmplitude;
      material.uniforms.uWavesSpeed.value = wavesSpeed;
      material.uniforms.uWavesFrequency.value = wavesFrequency;
      material.uniforms.uWavesPersistence.value = wavesPersistence;
      material.uniforms.uWavesLacunarity.value = wavesLacunarity;
      material.uniforms.uWavesIterations.value = wavesIterations;

      // Update of the colors
      material.uniforms.uTroughColor.value.set(...troughColor);
      material.uniforms.uSurfaceColor.value.set(...surfaceColor);
      material.uniforms.uPeakColor.value.set(...peakColor);

      // Update of the transitions
      material.uniforms.uPeakThreshold.value = peakThreshold;
      material.uniforms.uPeakTransition.value = peakTransition;
      material.uniforms.uTroughThreshold.value = troughThreshold;
      material.uniforms.uTroughTransition.value = troughTransition;

      // Update of Fresnel
      material.uniforms.uFresnelScale.value = fresnelScale;
      material.uniforms.uFresnelPower.value = fresnelPower;

      // Update of opacity
      material.uniforms.uOpacity.value = opacity;

      // Update of the environment map if available
      if (scene.environment && !material.uniforms.uEnvironmentMap.value) {
        material.uniforms.uEnvironmentMap.value = scene.environment;
      }
    }
  });

  return (
    <group>
      {/* Visible water surface */}
      <mesh
        ref={meshRef}
        position={position}
        rotation={[-Math.PI / 2, 0, 0]} // Rotation to make the plane horizontal
        geometry={geometry}
        material={material}
      />

      {/* Invisible collider to prevent the player from exceeding the surface */}
      <RigidBody
        type="fixed"
        position={[0, position[1] - 0.5, 0]} // Centered and just below the surface
        colliders={false}
      >
        <CuboidCollider
          args={[200, 1, 200]} // Large zone to cover the entire aquarium
          position={[0, 0, 0]}
        />
      </RigidBody>
    </group>
  );
}

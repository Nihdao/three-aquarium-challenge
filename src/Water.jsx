import { useRef, useMemo } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import vertexShader from "./shaders/waves/vertex.glsl?raw";
import fragmentShader from "./shaders/waves/fragment.glsl?raw";

// Extension du matériau personnalisé
extend({ ShaderMaterial: THREE.ShaderMaterial });

export default function Water({
  // Paramètres de position et taille
  position = [0, 125, -50],
  sizeX = 160,
  sizeZ = 50,
  segments = 512,

  // Paramètres des vagues (contrôlés par Leva)
  wavesAmplitude = 2.0,
  wavesSpeed = 0.5,
  wavesFrequency = 0.02,
  wavesPersistence = 0.5,
  wavesLacunarity = 2.0,
  wavesIterations = 3.0,

  // Paramètres de couleur (contrôlés par Leva)
  troughColor = [0.1, 0.3, 0.5],
  surfaceColor = [0.2, 0.5, 0.8],
  peakColor = [0.4, 0.7, 1.0],

  // Paramètres de transition (contrôlés par Leva)
  peakThreshold = 1.0,
  peakTransition = 0.5,
  troughThreshold = -1.0,
  troughTransition = 0.5,

  // Paramètres Fresnel (contrôlés par Leva)
  fresnelScale = 0.5,
  fresnelPower = 2.0,

  // Paramètres généraux
  opacity = 0.8,
}) {
  const meshRef = useRef();
  const { scene } = useThree();

  // Création de la géométrie plane
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(sizeX, sizeZ, segments, segments);
  }, [sizeX, sizeZ, segments]);

  // Uniforms pour le shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },

      // Paramètres des vagues
      uWavesAmplitude: { value: wavesAmplitude },
      uWavesSpeed: { value: wavesSpeed },
      uWavesFrequency: { value: wavesFrequency },
      uWavesPersistence: { value: wavesPersistence },
      uWavesLacunarity: { value: wavesLacunarity },
      uWavesIterations: { value: wavesIterations },

      // Paramètres de couleur
      uTroughColor: { value: new THREE.Vector3(...troughColor) },
      uSurfaceColor: { value: new THREE.Vector3(...surfaceColor) },
      uPeakColor: { value: new THREE.Vector3(...peakColor) },

      // Paramètres de transition
      uPeakThreshold: { value: peakThreshold },
      uPeakTransition: { value: peakTransition },
      uTroughThreshold: { value: troughThreshold },
      uTroughTransition: { value: troughTransition },

      // Paramètres Fresnel
      uFresnelScale: { value: fresnelScale },
      uFresnelPower: { value: fresnelPower },

      // Environment map (sera défini plus tard)
      uEnvironmentMap: { value: null },

      // Opacité
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

  // Création du matériau shader
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [uniforms]);

  // Mise à jour des uniforms en temps réel
  useFrame((state) => {
    if (material.uniforms) {
      material.uniforms.uTime.value = state.clock.elapsedTime;

      // Mise à jour des paramètres de vagues
      material.uniforms.uWavesAmplitude.value = wavesAmplitude;
      material.uniforms.uWavesSpeed.value = wavesSpeed;
      material.uniforms.uWavesFrequency.value = wavesFrequency;
      material.uniforms.uWavesPersistence.value = wavesPersistence;
      material.uniforms.uWavesLacunarity.value = wavesLacunarity;
      material.uniforms.uWavesIterations.value = wavesIterations;

      // Mise à jour des couleurs
      material.uniforms.uTroughColor.value.set(...troughColor);
      material.uniforms.uSurfaceColor.value.set(...surfaceColor);
      material.uniforms.uPeakColor.value.set(...peakColor);

      // Mise à jour des transitions
      material.uniforms.uPeakThreshold.value = peakThreshold;
      material.uniforms.uPeakTransition.value = peakTransition;
      material.uniforms.uTroughThreshold.value = troughThreshold;
      material.uniforms.uTroughTransition.value = troughTransition;

      // Mise à jour Fresnel
      material.uniforms.uFresnelScale.value = fresnelScale;
      material.uniforms.uFresnelPower.value = fresnelPower;

      // Mise à jour opacité
      material.uniforms.uOpacity.value = opacity;

      // Mise à jour de l'environment map si disponible
      if (scene.environment && !material.uniforms.uEnvironmentMap.value) {
        material.uniforms.uEnvironmentMap.value = scene.environment;
      }
    }
  });

  return (
    <group>
      {/* Surface de l'eau visible */}
      <mesh
        ref={meshRef}
        position={position}
        rotation={[-Math.PI / 2, 0, 0]} // Rotation pour que le plan soit horizontal
        geometry={geometry}
        material={material}
      />

      {/* Collider invisible pour empêcher le joueur de dépasser la surface */}
      <RigidBody
        type="fixed"
        position={[0, position[1] - 0.5, 0]} // Centré et juste sous la surface
        colliders={false}
      >
        <CuboidCollider
          args={[200, 1, 200]} // Zone large pour couvrir tout l'aquarium
          position={[0, 0, 0]}
        />
      </RigidBody>
    </group>
  );
}

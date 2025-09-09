import { forwardRef, useMemo, useRef } from "react";
import { Uniform } from "three";
import { Effect } from "postprocessing";
import { useFrame } from "@react-three/fiber";

const fragmentShader = /* glsl */ `
uniform float time;
uniform float strength;
uniform float waterColorIntensity;
uniform vec3 waterColor;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Create multiple waves with different frequencies
  float wave1 = sin(uv.x * 15.0 + time * 2.0) * 0.003;
  float wave2 = sin(uv.y * 12.0 + time * 1.5) * 0.002;
  float wave3 = sin((uv.x + uv.y) * 8.0 + time * 3.0) * 0.0015;
  
  // Combine the waves
  vec2 distortion = vec2(wave1 + wave3, wave2 + wave3) * strength;
  
  // Apply the distortion to the UV coordinates
  vec2 distortedUV = uv + distortion;
  
  // Sample the texture with the distorted UVs
  vec4 distortedColor = texture2D(inputBuffer, distortedUV);
  
  // Apply the blue filter of the water
  // Mélanger avec la couleur de l'eau basé sur l'intensité
  vec3 finalColor = mix(distortedColor.rgb, distortedColor.rgb * waterColor, waterColorIntensity);
  
  // Slight desaturation for a more realistic effect
  float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
  finalColor = mix(finalColor, vec3(luminance), 0.1);
  
  // Add a slight blue tint globally
  finalColor = mix(finalColor, waterColor, waterColorIntensity * 0.2);
  
  outputColor = vec4(finalColor, distortedColor.a);
}
`;

class WaterWaveEffectImpl extends Effect {
  constructor({
    strength = 1.0,
    waterColorIntensity = 0.3,
    waterColor = [0.663, 0.796, 1.0],
  } = {}) {
    super("WaterWaveEffect", fragmentShader, {
      uniforms: new Map([
        ["time", new Uniform(0)],
        ["strength", new Uniform(strength)],
        ["waterColorIntensity", new Uniform(waterColorIntensity)],
        ["waterColor", new Uniform(waterColor)],
      ]),
    });
  }
}

export const WaterWaveEffect = forwardRef(
  (
    {
      strength = 1.0,
      waterColorIntensity = 0.3,
      waterColor = [0.663, 0.796, 1.0],
    },
    ref
  ) => {
    const effect = useMemo(
      () =>
        new WaterWaveEffectImpl({ strength, waterColorIntensity, waterColor }),
      [strength, waterColorIntensity, waterColor]
    );

    useFrame((state) => {
      if (effect.uniforms) {
        effect.uniforms.get("time").value = state.clock.elapsedTime;
      }
    });

    return <primitive ref={ref} object={effect} />;
  }
);

WaterWaveEffect.displayName = "WaterWaveEffect";

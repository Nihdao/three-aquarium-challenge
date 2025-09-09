import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

export default function NPCFish({
  fishType = "./assets/Goldfish.glb",
  position = [0, 100, 0],
  pattern = "circular",
  scale = 2,
  speed = 1,
}) {
  const fish = useGLTF(fishType);
  const animations = useAnimations(fish.animations, fish.scene);
  const fishRef = useRef();
  const timeRef = useRef(0);

  // Initial position for the movement calculations
  const initialPosition = useRef(position);
  const patternCenter = useRef(position);

  // Parameters of the movement patterns
  const movementParams = useRef({
    circular: {
      radius: 15,
      speed: speed * 0.5,
      verticalOffset: 0,
    },
    figure8: {
      radius: 20,
      speed: speed * 0.8,
      verticalOffset: 0,
    },
    random: {
      targetPosition: [...position],
      changeInterval: 3, // Change direction every 3 seconds
      lastChange: 0,
      range: 25,
    },
  });

  // Configuration of the materials for DoubleSide
  useEffect(() => {
    fish.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            material.side = THREE.DoubleSide;
          });
        } else {
          child.material.side = THREE.DoubleSide;
        }
      }
    });
  }, [fish.scene]);

  // Play the swim animation if it exists
  useEffect(() => {
    const swimAnimation =
      animations.actions["Fish_Armature|Swimming_Fast"] ||
      animations.actions["swim"] ||
      animations.actions["Swimming"] ||
      animations.actions["Armature|Swimming"];
    if (swimAnimation) {
      swimAnimation.play();
    } else {
      // If there is no specific swim animation, play the first animation
      const firstAnimation = Object.values(animations.actions)[0];
      if (firstAnimation) {
        firstAnimation.play();
      }
    }
  }, [animations]);

  // Movement patterns
  const calculateMovement = (delta) => {
    timeRef.current += delta;
    const params = movementParams.current;

    switch (pattern) {
      case "circular":
        return {
          x:
            patternCenter.current[0] +
            Math.cos(timeRef.current * params.circular.speed) *
              params.circular.radius,
          y: patternCenter.current[1] + params.circular.verticalOffset,
          z:
            patternCenter.current[2] +
            Math.sin(timeRef.current * params.circular.speed) *
              params.circular.radius,
        };

      case "figure8":
        const t = timeRef.current * params.figure8.speed;
        return {
          x: patternCenter.current[0] + Math.sin(t) * params.figure8.radius,
          y: patternCenter.current[1] + params.figure8.verticalOffset,
          z:
            patternCenter.current[2] +
            Math.sin(t * 2) * (params.figure8.radius * 0.5),
        };

      case "random":
        // Change direction periodically
        if (
          timeRef.current - params.random.lastChange >
          params.random.changeInterval
        ) {
          params.random.targetPosition = [
            patternCenter.current[0] +
              (Math.random() - 0.5) * params.random.range,
            patternCenter.current[1] +
              (Math.random() - 0.5) * params.random.range * 0.5,
            patternCenter.current[2] +
              (Math.random() - 0.5) * params.random.range,
          ];
          params.random.lastChange = timeRef.current;
        }

        // Interpolate towards the target position
        const currentPos = fishRef.current?.translation();
        if (currentPos) {
          const lerpFactor = delta * speed * 0.5;
          return {
            x: THREE.MathUtils.lerp(
              currentPos.x,
              params.random.targetPosition[0],
              lerpFactor
            ),
            y: THREE.MathUtils.lerp(
              currentPos.y,
              params.random.targetPosition[1],
              lerpFactor
            ),
            z: THREE.MathUtils.lerp(
              currentPos.z,
              params.random.targetPosition[2],
              lerpFactor
            ),
          };
        }
        break;

      default:
        return { x: position[0], y: position[1], z: position[2] };
    }
  };

  // Calculate the rotation to make the fish look in the direction of the movement
  const calculateRotation = (currentPos, nextPos) => {
    const direction = new THREE.Vector3(
      nextPos.x - currentPos.x,
      nextPos.y - currentPos.y,
      nextPos.z - currentPos.z
    ).normalize();

    if (direction.length() > 0.01) {
      const targetRotation = new THREE.Euler();
      targetRotation.y = Math.atan2(direction.x, direction.z);
      targetRotation.x = -Math.asin(direction.y);
      return targetRotation;
    }
    return null;
  };

  useFrame((state, delta) => {
    if (!fishRef.current) return;

    const currentPos = fishRef.current.translation();
    const nextPos = calculateMovement(delta);

    if (nextPos) {
      // Apply the movement with a smooth interpolation
      const lerpFactor = delta * speed * 2;
      const newPosition = {
        x: THREE.MathUtils.lerp(currentPos.x, nextPos.x, lerpFactor),
        y: THREE.MathUtils.lerp(currentPos.y, nextPos.y, lerpFactor),
        z: THREE.MathUtils.lerp(currentPos.z, nextPos.z, lerpFactor),
      };

      fishRef.current.setTranslation(newPosition, true);

      // Calculate and apply the rotation
      const rotation = calculateRotation(currentPos, nextPos);
      if (rotation) {
        const currentRotation = fishRef.current.rotation();
        const targetQuaternion = new THREE.Quaternion().setFromEuler(rotation);
        const currentQuaternion = new THREE.Quaternion(
          currentRotation.x,
          currentRotation.y,
          currentRotation.z,
          currentRotation.w
        );

        currentQuaternion.slerp(targetQuaternion, delta * speed * 3);
        fishRef.current.setRotation(currentQuaternion, true);
      }
    }
  });

  return (
    <RigidBody
      ref={fishRef}
      position={position}
      mass={0.5}
      colliders={false}
      type="dynamic"
      gravityScale={0} // No gravity for the fish
    >
      <CuboidCollider args={[0.8, 0.6, 0.8]} />
      <primitive object={fish.scene} scale={scale} position={[0, 0, 0]} />
    </RigidBody>
  );
}

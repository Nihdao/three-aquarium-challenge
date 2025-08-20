export default function DebugMarker({ position = [0, 2, 0], color = "red" }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 5, 0.5]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default function AttackHitbox({ isAttacking }) {
  if (!isAttacking) return null;

  return (
    <mesh position={[0, 0, 2]} visible={true}>
      <boxGeometry args={[1.5, 1.5, 1]} />
      <meshBasicMaterial
        color="red"
        transparent={true}
        opacity={0.5}
        wireframe={true}
      />
    </mesh>
  );
}

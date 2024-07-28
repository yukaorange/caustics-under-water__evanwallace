export const Box = ({
  position = [0, 0, 0],
}: {
  position?: [number, number, number]
}) => {
  return (
    <mesh
      position={position}
      rotation={[Math.PI / 3, Math.PI / 3, 0]}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#525961" />
    </mesh>
  )
}

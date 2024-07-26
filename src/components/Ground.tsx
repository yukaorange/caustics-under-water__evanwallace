import { useThree, useFrame, useLoader } from '@react-three/fiber'
import { useRef, useMemo, useEffect, useContext } from 'react'
import * as THREE from 'three'

import groundVertexShader from '@/shaders/ground-vertex.glsl'
import groundFragmentShader from '@/shaders/ground-fragment.glsl'

export const Ground = () => {
  const { gl } = useThree()
  const meshRef = useRef<THREE.Mesh>(null)
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null)
  const sceneRef = useRef(new THREE.Scene())
  const cameraRef = useRef(new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 1))
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  const normalMap = useLoader(
    THREE.TextureLoader,
    '/textures/normal_ground_3.jpg',
  )

  useMemo(() => {
    renderTargetRef.current = new THREE.WebGLRenderTarget(1024, 1024)
    cameraRef.current.position.z = 1
  }, [])

  useMemo(() => {
    materialRef.current = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: renderTargetRef.current?.texture },
      },
      vertexShader: groundVertexShader,
      fragmentShader: groundFragmentShader,
    })
  }, [])

  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(2, 2, 30, 30)
    const mesh = new THREE.Mesh(
      geometry,
      materialRef.current as THREE.ShaderMaterial,
    )

    sceneRef.current.add(mesh)

    gl.setRenderTarget(renderTargetRef.current)
    gl.render(sceneRef.current, cameraRef.current)
    gl.setRenderTarget(null)
  }, [])

  return (
    <>
      <mesh
        position={[0, -1, 0]}
        ref={meshRef}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshStandardMaterial
          normalMap={normalMap}
          normalScale={new THREE.Vector2(2, 2)}
          displacementScale={1}
          displacementMap={renderTargetRef.current?.texture}
        />
      </mesh>
    </>
  )
}

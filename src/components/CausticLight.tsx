import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import causticVertexShader from '@/shaders/caustic-vertex.glsl'
import causticFragmentShader from '@/shaders/caustic-fragment.glsl'

interface CausticLightProps {
  position?: [number, number, number]
  intensity?: number
  angle?: number
  penumbra?: number
  targetPosition?: [number, number, number]
  resolution?: number
  color?: THREE.ColorRepresentation
  [key: string]: any
}

export const CausticLight = ({
  position = [0, 5, 0],
  intensity = 1,
  angle = -Math.PI / 4,
  penumbra = 0.5,
  targetPosition = [0, 0, 0],
  color = '#9ab4e4',
  ...props
}: CausticLightProps) => {
  const { wave_1, wave_2, lightIntensity } = props.controls

  const { gl } = useThree()

  const lightRef = useRef<THREE.SpotLight | null>(null)
  const renderTargetRef = useRef<THREE.WebGLRenderTarget>()
  const sceneRef = useRef(new THREE.Scene())
  const cameraRef = useRef(new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 1))
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D())

  useMemo(() => {
    renderTargetRef.current = new THREE.WebGLRenderTarget(1024, 1024)
    cameraRef.current.position.z = 1
  }, [])

  useMemo(() => {
    materialRef.current = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uWave1: { value: wave_1 },
        uWave2: { value: wave_2 },
        uLightIntensity: { value: lightIntensity },
      },
      vertexShader: causticVertexShader,
      fragmentShader: causticFragmentShader,
    })
  }, [])

  useEffect(() => {
    targetRef.current.position.set(...targetPosition)
  }, [targetPosition])

  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(2, 2, 200, 200)

    const mesh = new THREE.Mesh(
      geometry,
      materialRef.current as THREE.ShaderMaterial,
    )

    sceneRef.current.add(mesh)

    return () => {
      renderTargetRef.current?.dispose()
      materialRef.current?.dispose()
    }
  }, [])

  useFrame((state, delta) => {
    if (materialRef.current && renderTargetRef.current) {
      materialRef.current.uniforms.uTime.value += delta

      materialRef.current.uniforms.uWave1.value = wave_1
      materialRef.current.uniforms.uWave2.value = wave_2
      materialRef.current.uniforms.uLightIntensity.value = lightIntensity

      gl.setRenderTarget(renderTargetRef.current)
      gl.render(sceneRef.current, cameraRef.current)
      gl.setRenderTarget(null)

      if (lightRef.current) {
        lightRef.current.map = renderTargetRef.current.texture
      }
    }
  })

  return (
    <spotLight
      ref={lightRef}
      position={position}
      intensity={intensity}
      angle={angle}
      penumbra={penumbra}
      castShadow
      color={color}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      {...props}
    />
  )
}

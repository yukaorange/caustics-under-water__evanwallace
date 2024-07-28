import { Cone, Cylinder } from '@react-three/drei'
import { useMemo, useRef } from 'react'

import rayVertexShader from '@/shaders/ray-vertex.glsl'
import rayFragmentShader from '@/shaders/ray-fragment.glsl'
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

interface RayProps {
  position?: [number, number, number]
  rotation_x?: number
  rotation_z?: number
  radius?: number
  intensity: number
  [key: string]: any
}

export const Ray = ({
  position = [0, 5, 0] as [number, number, number],
  radius = 2,
  rotation_x = Math.PI / 6,
  rotation_z = 0,
  intensity = 1,
  ...props
}) => {
  const rayRef = useRef<THREE.Mesh | null>(null)

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: intensity },
      },
      vertexShader: rayVertexShader,
      fragmentShader: rayFragmentShader,
      transparent: true,
    })
  }, [])

  useFrame((state, delta) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value += delta

      shaderMaterial.uniforms.uIntensity.value = intensity
    }
  })

  return (
    <Cone
      ref={rayRef}
      position={position}
      rotation-x={rotation_x}
      rotation-z={rotation_z}
      args={[radius, 20, 32, 32]}
    >
      <primitive object={shaderMaterial} />
    </Cone>
    
  )
}

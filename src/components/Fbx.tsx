import { useLoader, useFrame } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { Logger } from 'sass'

interface FbxProps {
  url: string
  position: [number, number, number]
}

export const Fbx = ({ url, position }: FbxProps) => {
  const fbx = useLoader(FBXLoader, url)

  const mixerRef = useRef<THREE.AnimationMixer | null>(null)

  useEffect(() => {
    if (fbx && fbx.animations.length) {
      const mixer = new THREE.AnimationMixer(fbx)

      mixerRef.current = mixer

      const action = mixer.clipAction(fbx.animations[0])

      action.play()
    }
  }, [fbx])

  useEffect(() => {
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // child.material.receiveShadow = true
      }
    })
  }, [fbx])

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
  })

  return <primitive object={fbx} scale={0.001} position={position} />
}

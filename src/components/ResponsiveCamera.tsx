import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'

import * as THREE from 'three'

export const ResponsiveCamera = () => {
  const { viewport, camera } = useThree()
  const cameraRef = useRef(camera as THREE.PerspectiveCamera)

  useEffect(() => {
    const updateCameraPosition = () => {
      const aspect = viewport.width / viewport.height
      let x, y, z, fov

      if (aspect > 1) {
        // 横長の画面
        x = 7.5
        y = 5
        z = 7.5
        fov = 45
      } else {
        // 縦長の画面
        x = 10
        y = 5
        z = 10
        fov = 45
      }
      cameraRef.current.position.set(x, y, z)
      cameraRef.current.fov = fov
      cameraRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.1)
    }

    updateCameraPosition()
  }, [viewport])

  useFrame(() => {
    cameraRef.current.updateProjectionMatrix()
  })

  return null
}

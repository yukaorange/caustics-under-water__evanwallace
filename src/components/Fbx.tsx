import { useLoader, useFrame } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { Logger } from 'sass'
import { Suspense } from 'react'

import vetexShader from '@/shaders/whale-vertex.glsl'
import fragmentShader from '@/shaders/whale-fragment.glsl'

interface FbxProps {
  url: string
  position: [number, number, number]
}

export const Fbx = ({ url, position }: FbxProps) => {
  return (
    <Suspense fallback={null}>
      <LoadedFbx url={url} position={position} />
    </Suspense>
  )
}

export const LoadedFbx = ({ url, position }: FbxProps) => {
  const fbx = useLoader(FBXLoader, url)

  const mixerRef = useRef<THREE.AnimationMixer | null>(null)

  const timeRef = useRef<{ value: number }>({ value: 0 })

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
      if (child instanceof THREE.Mesh) {
        child.material.transparent = true
        child.material.side = THREE.DoubleSide
        child.material.depthWrite = false
        child.material.blending = THREE.AdditiveBlending

        const material = child.material as THREE.MeshPhongMaterial

        material.userData = {
          time: timeRef.current,
          color: new THREE.Uniform(new THREE.Color('#023042')),
        }

        material.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = material.userData.time
          shader.uniforms.uColor = material.userData.color

          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            /*glsl*/ `
            uniform float uTime;
            varying vec3 vMyNormal;
            varying vec3 vWorldPosition;

            float random(vec2 st){
              return fract(sin(dot(st.xy,
              vec2(12.9898,78.233)))*
              43758.5453123);
            }

            float random2D(vec2 value){
              return fract(sin(dot(value, vec2(12.9898, 78.233))) * 43758.5453);
            }


            #include <common>;
            `,
          )

          shader.vertexShader = shader.vertexShader.replace(
            '#include <worldpos_vertex>',
            /*glsl*/ `
            #include <worldpos_vertex>

            float glitchTime = uTime - worldPosition.y;

            float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.4);

            glitchStrength /= 2.0;
            
            glitchStrength *= 0.15;

            worldPosition.x += (random2D(worldPosition.xz + uTime) - 0.5)* glitchStrength;
            worldPosition.z += (random2D(worldPosition.zx + uTime) - 0.5)*glitchStrength;

            vWorldPosition = worldPosition.xyz;

            vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

            vMyNormal = modelNormal.xyz;

            gl_Position = projectionMatrix * viewMatrix * worldPosition;
            `,
          )

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            /*glsl*/ `
            uniform float uTime;
            uniform vec3 uColor;
            varying vec3 vMyNormal;
            varying vec3 vWorldPosition;
            #include <common>;
            `,
          )

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <output_fragment>',
            fragmentShader,
          )

          console.log(
            `
            vertex:${shader.vertexShader}
            `,
            '\n',
            // `fragment:${shader.fragmentShader}`,
          )
        }
      }
    })
  }, [fbx])

  useFrame((state, delta) => {
    const { clock } = state

    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    const radius = 3

    const time = clock.getElapsedTime() * 0.5

    const newPosition = new THREE.Vector3(
      Math.cos(time) * radius,
      1.5,
      Math.sin(time) * radius,
    )

    const direction = new THREE.Vector3()
      .subVectors(newPosition, fbx.position)
      .normalize()

    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction,
    )

    timeRef.current.value = time

    fbx.quaternion.slerp(targetQuaternion, 0.1)

    fbx.position.copy(newPosition)
  })

  return <primitive object={fbx} scale={0.002} position={position} />
}

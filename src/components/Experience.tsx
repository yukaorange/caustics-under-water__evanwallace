import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { ResponsiveCamera } from '@/components/ResponsiveCamera'

import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

import { Fbx } from '@/components/Fbx'
import { Ground } from '@/components/Ground'
import { Ray } from '@/components/Ray'
import { CausticLight } from '@/components/CausticLight'
import { Leva, useControls } from 'leva'

export const Experience = (): JSX.Element => {
  const {
    lightIntensity,
    wave_1,
    wave_2,
    color,
    rayIntensity,
    rayPos_1,
    rayPos_2,
    rayPos_3,
  } = useControls({
    lightIntensity: {
      value: 0.4,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    wave_1: {
      value: 7.1,
      min: 0,
      max: 10,
      step: 0.1,
    },
    wave_2: {
      value: 5.9,
      min: 0,
      max: 10,
      step: 0.1,
    },
    color: {
      value: '#9ab4e4',
      label: 'Color',
      colors: true,
      options: ['#9ab4e4', '#28519c', '#1e2a4a', '#0d0f18'],
    },
    rayIntensity: {
      value: 0.6,
      min: 0.01,
      max: 1.5,
      step: 0.01,
    },
    rayPos_1: {
      value: [-7, 4, 0],
    },
    rayPos_2: {
      value: [0, 4, -1],
    },
    rayPos_3: {
      value: [5, 4, 5],
    },
  })

  const lightControls = {
    wave_1: wave_1,
    wave_2: wave_2,
    lightIntensity: lightIntensity,
  }

  const rayControls = {
    lightIntensity: rayIntensity,
  }

  return (
    <>
      <Leva collapsed />
      <Canvas>
        <ResponsiveCamera />
        <Perf position="top-left" />
        <fog attach="fog" args={['#28519c', 5, 20]} />
        <color attach="background" args={['#28519c']} />
        <ambientLight intensity={1} color={'#000000'} />
        <Suspense>
          <CausticLight
            position={[0, 4, 0]}
            color={color}
            controls={lightControls}
          />
          <Ray radius={2} position={rayPos_1} intensity={rayIntensity} />
          <Ray radius={1} position={rayPos_2} intensity={rayIntensity} />
          <Ray radius={1} position={rayPos_3} intensity={rayIntensity} />
          <Fbx url="/models/whale.fbx" position={[0, 5, 0]} />
          <Ground />
        </Suspense>
      </Canvas>
    </>
  )
}

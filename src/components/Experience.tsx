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
import { Box } from './Box'

export const Experience = (): JSX.Element => {
  const {
    lightIntensity,
    wave_1,
    wave_2,
    color,
    rayIntensity,
    pos_1,
    pos_2,
    // pos_3,
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
      value: 3.2,
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
    pos_1: {
      value: [1, 2, 2],
    },
    pos_2: {
      value: [0.3, 0.2, 0],
    },
    // pos_3: {
    //   value: [5, 4, 5],
    // },
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
      <Canvas shadows>
        <ResponsiveCamera />
        {/* <Perf position="top-left" /> */}
        <fog attach="fog" args={['#28519c', 5, 20]} />
        <color attach="background" args={['#28519c']} />
        <ambientLight intensity={1} color={'#000000'} />
        <Suspense>
          <CausticLight
            position={[0, 4, 0]}
            color={color}
            controls={lightControls}
          />
          <Ray radius={4} position={pos_1} intensity={rayIntensity} />
          {/* <Ray radius={1} position={pos_2} intensity={rayIntensity} /> */}
          {/* <Ray radius={1} position={pos_3} intensity={rayIntensity} /> */}
          <Fbx url="/models/whale.fbx" position={[0, 5, 0]} />
          <Box position={pos_2} />
          <Ground />
        </Suspense>
      </Canvas>
    </>
  )
}

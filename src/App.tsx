import { Experience } from '@/components/Experience'
import { Sns } from '@/components/Sns'
import { MenuButton } from '@/components/MenuButton'
import { Loader } from '@react-three/drei'
import { Suspense, useRef } from 'react'

const App = () => {
  return (
    <>
      <MenuButton />
      <Sns />
      <Experience />
    </>
  )
}

export default App

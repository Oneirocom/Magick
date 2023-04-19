import React, { Suspense } from 'react'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Debug, Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { Camera } from './Camera'
import { Avatar } from './Avatar'
import { AXIS_LEN } from '../../utils/constants'


export const Scene = () => {
  return (
    <Canvas>
      {/* <Perf position="top-left"/> */}

      {/* <OrbitControls makeDefault /> */}

      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
        shadow-normalBias={0.04}
      >
        <OrthographicCamera />
      </directionalLight>
      <ambientLight intensity={0.5} />

      <axesHelper args={[AXIS_LEN]} />

      <Suspense>
        <Physics colliders="hull">
          <Avatar />
          {/* <Debug/> */}
        </Physics>
      </Suspense>

      <Camera />
    </Canvas>
  )
}

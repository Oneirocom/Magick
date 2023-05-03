import React, { Suspense } from 'react'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Debug, Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { Camera } from './Camera'
import { Avatar } from './Avatar'
import { AXIS_LEN } from '../../utils/constants'
import { Watch } from './Watch'


export const Scene = () => {
  return (
    <Canvas>
      {/* <Perf position="top-right"/> */}

      {/* character move with mouse right & left button click */}
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

      {/* <axesHelper args={[AXIS_LEN]} /> */}

      <Suspense>
        <Physics colliders="hull">
          <Avatar />
          <Watch />
          {/* <Debug/> */}
        </Physics>
      </Suspense>

      <Camera />
    </Canvas>
  )
}

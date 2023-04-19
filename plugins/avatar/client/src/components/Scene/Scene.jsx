import React, {Suspense} from 'react'
import {OrbitControls, OrthographicCamera} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
// eslint-disable-next-line no-unused-vars
import {Debug, Physics} from '@react-three/rapier'
// eslint-disable-next-line no-unused-vars
import {Perf} from 'r3f-perf'
import {Ground} from './Ground'
import {Camera} from './Camera'
import {useZustand} from '../../store/useZustand'


export const Scene = () => {
  return (
    <Canvas>
      {/* <Perf position="top-left"/> */}

      <OrbitControls makeDefault/>

      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
        shadow-normalBias={0.04}
      >
        <OrthographicCamera/>
      </directionalLight>
      <ambientLight
        intensity={0.5}
      />

      {/* <axesHelper
        // eslint-disable-next-line react/no-unknown-property
        args={[GROUND_SIZE]}
      /> */}

      <Suspense>
        <Physics colliders="hull">
          <Ground/>
          {/* <Debug/> */}
        </Physics>
      </Suspense>

      <Camera/>
    </Canvas>
  )
}

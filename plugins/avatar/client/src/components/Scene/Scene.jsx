import React, { Suspense } from 'react'
import { OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { XR, VRButton, Controllers } from '@react-three/xr'
import { Camera } from './Camera'
import { Avatar } from './Avatar'
import { Watch } from './Watch'

export const Scene = () => {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR frameRate={72 | 90 | 120} referenceSpace="local-floor">
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

          <Suspense>
            <Physics colliders="hull">
              <Avatar />
              <Watch />
              <Button position={[0, 0.1, -0.2]} />
            </Physics>
          </Suspense>
          <Controllers />
          <Camera />
        </XR>
      </Canvas>
    </>
  )
}

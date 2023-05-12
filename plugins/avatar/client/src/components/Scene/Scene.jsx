import React, { Suspense, useState } from 'react'
import { OrbitControls, OrthographicCamera, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Debug, Physics } from '@react-three/rapier'
import { Interactive, XR, VRButton, Controllers, } from '@react-three/xr'
import { Perf } from 'r3f-perf'
import { Camera } from './Camera'
import { Avatar } from './Avatar'
import { AXIS_LEN } from '../../utils/constants'
import { Watch } from './Watch'

function Box({ color, size, scale, children, ...rest }) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry args={size} />
      <meshPhongMaterial color={color} />
      {children}
    </mesh>
  )
}

function Button(props) {
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState('blue')

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0)
  }

  return (
    <Interactive onHover={() => setHover(true)} onBlur={() => setHover(false)} onSelect={onSelect}>
      <Box color={color} scale={hover ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]} size={[0.4, 0.1, 0.1]} {...props}>
        <Suspense fallback={null}>
          <Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle">
            Hello react-xr!
          </Text>
        </Suspense>
      </Box>
    </Interactive>
  )
}

export const Scene = () => {

  return (
    <Canvas>
      <XR
        frameRate={72 | 90 | 120}
        referenceSpace="local-floor"
      >
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
  )
}

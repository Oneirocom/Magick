import { Suspense, useState } from 'react'
import { Interactive, XR, VRButton, Controllers } from '@react-three/xr'
import { Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import './XrTest.css'

function Box({ color, size, scale, children, ...rest }: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry args={size} />
      <meshPhongMaterial color={color} />
      {children}
    </mesh>
  )
}

function Button(props: any) {
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState<any>('blue')

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

export function XrTest() {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR referenceSpace="local">
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Button position={[0, 0.1, -0.2]} />
          <Controllers />
        </XR>
      </Canvas>
    </>
  )
}

import React from 'react'
import {PerspectiveCamera} from '@react-three/drei'
import {useZustand} from '../../store/useZustand'


export const Camera = () => {
  const {cameraInitPos} = useZustand()

  return (
    <PerspectiveCamera
      makeDefault
      position={cameraInitPos}
    />
  )
}

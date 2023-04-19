import React from 'react'
import { useGLTF } from '@react-three/drei'
import { useZustand } from '../../store/useZustand'


export const Avatar = () => {
  const { avatarInitPos } = useZustand()
  const gltf = useGLTF('/models/avatar2.vrm')

  return (
    <primitive
      object={gltf.scene}
      position={avatarInitPos}
    />
  )
}

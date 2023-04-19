import React from 'react'
import {Plane} from '@react-three/drei'
import {RigidBody} from '@react-three/rapier'
import {GROUND_SIZE} from '../../utils/constants'


export const Ground = () => {
  return (
    <RigidBody>
      <Plane
        position={[0, 0, 0]}
        receiveShadow
        rotation={[- Math.PI * 0.5, 0, 0]}
        scale={GROUND_SIZE}
      >
        <meshStandardMaterial color="#87493b"/>
      </Plane>
    </RigidBody>
  )
}

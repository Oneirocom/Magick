import React from 'react'
import { Plane } from '@react-three/drei'
import { useGesture } from '@use-gesture/react'
import { WATCH_INIT_POS } from '../../utils/constants'
import { customDebug } from '../../utils/custom.debug'


export const Watch = () => {
  const bind = useGesture({
    onPointerMove: (state) => {
      const point = state?.event?.point
      customDebug().log('Watch#onPointerMove: point: ', point)
    },
  })


  return (
    <Plane
      position={WATCH_INIT_POS}
      receiveShadow
      scale={0.3}
      {...bind()}
    >
      <meshStandardMaterial
        transparent={true}
        opacity={0.3}
      />
    </Plane>
  )
}

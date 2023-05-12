import React from 'react'
import { Plane, Html } from '@react-three/drei'
import { useGesture } from '@use-gesture/react'
import { AXIS_LEN, WATCH_BONE_NAME, WATCH_INIT_POS } from '../../utils/constants'
import { useZustand } from '../../store/useZustand'
import { AxesHelper } from 'three'


export const Watch = () => {
  const {
    avatarVrm,
  } = useZustand()

  const bind = useGesture({
    onPointerMove: (state) => {
      if (!avatarVrm) {
        return
      }
      const point = state?.event?.point
      // customDebug().log('Watch#onPointerMove: point: ', point)
      const watchBoneNode = avatarVrm.humanoid?.getBoneNode(WATCH_BONE_NAME)
      // customDebug().log('Watch#onPointerMove: watchBoneNode: ', watchBoneNode)
      // watchBoneNode.add(new AxesHelper(AXIS_LEN))
      watchBoneNode.lookAt(point)
    },
  })
  return (
    <Plane
      position={WATCH_INIT_POS}
      receiveShadow
      scale={4}
      {...bind()}
    >
      <meshStandardMaterial
        transparent={true}
        opacity={0}
      />
    </Plane>
  )
}

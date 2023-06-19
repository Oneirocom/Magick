import React from 'react'
import { Plane, Html } from '@react-three/drei'
import { useGesture } from '@use-gesture/react'
import { AXIS_LEN, WATCH_BONE_NAME, WATCH_INIT_POS } from '../../utils/constants'
import { useZustand } from '../../store/useZustand'
import { AxesHelper, Vector3 } from 'three'


export const Watch = () => {
  const {
    avatarVrm,
  } = useZustand()

  const bind = useGesture({
    onPointerMove: (state) => {
      if (!avatarVrm) {
        return
      }
      const watchBoneNode = avatarVrm.humanoid?.getBoneNode(WATCH_BONE_NAME)
      let point = new Vector3()
      point = state?.event?.point
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

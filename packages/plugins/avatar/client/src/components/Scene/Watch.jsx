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
      const isFront = avatarVrm.lookAt.faceFront.z === 1
      const watchBoneNode = avatarVrm.humanoid?.getBoneNode(WATCH_BONE_NAME)
      let point = new Vector3()

      if (isFront) {
        point = state?.event?.point
      } else {
        const headPos = new Vector3();
        headPos.setFromMatrixPosition( watchBoneNode.matrixWorld );
        const direcVec3 = headPos.clone().sub(state?.event?.point.clone())
        point.copy(headPos.clone().add(direcVec3))
      }
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

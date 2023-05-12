import React, { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import { useZustand } from '../../store/useZustand'
import { useVrmMixamoAnimations } from '../../hooks/useVrmMixamoAnimations'
import { BlinkManager } from '../../utils/blink.manager'
import { WATCH_BONE_NAME } from '../../utils/constants'

export const Avatar = () => {
  const {
    avatarInitPos,
    avatarVrm,
  } = useZustand()

  const fbx = useFBX('/models/magic idle.fbx')

  const { mixer, mixamoClip } = useVrmMixamoAnimations(avatarVrm, fbx.animations, [WATCH_BONE_NAME])

  useEffect(() => {
    if (!mixer || !mixamoClip) {
      return
    }
    mixer.timeScale = 1;
    mixer.clipAction(mixamoClip).play();
  }, [mixer, mixamoClip])

  useEffect(() => {
    if (!avatarVrm) {
      return
    }
    const newBlinkManager = new BlinkManager()
    newBlinkManager.addBlinker(avatarVrm)
  }, [avatarVrm])

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }
  })

  return avatarVrm && avatarVrm.scene && (
    <primitive
      object={avatarVrm.scene}
      position={avatarInitPos}
      rotation={[0, Math.PI / 10, 0]}
    />
  )
}

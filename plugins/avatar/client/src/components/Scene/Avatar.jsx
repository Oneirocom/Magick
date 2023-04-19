import React, { useEffect } from 'react'
import { useFBX } from '@react-three/drei'
import { useZustand } from '../../store/useZustand'
import { customDebug } from '../../utils/custom.debug'
import { useVrm } from '../../hooks/useVrm'
import { useVrmMixamoAnimations } from '../../hooks/useVrmMixamoAnimations'
import { useFrame } from '@react-three/fiber'
import { BlinkManager } from '../../utils/blink.manager'


export const Avatar = () => {
  const {
    avatarInitPos,
    setAvatarVrm,
  } = useZustand()
  const avatarVrm = useVrm('/models/avatar2.vrm')
  customDebug().log('Avatar: avatarVrm: ', avatarVrm)

  const fbx = useFBX('/models/magic idle.fbx')
  customDebug().log('Avatar: fbx: ', fbx)

  const { mixer, mixamoClip } = useVrmMixamoAnimations(avatarVrm, fbx.animations)
  customDebug().log('Avatar: mixer: ', mixer)
  customDebug().log('Avatar: mixamoClip: ', mixamoClip)


  useEffect(() => {
    if (!avatarVrm) {
      return
    }
    customDebug().log('Avatar#useEffect')
    const newBlinkManager = new BlinkManager()
    newBlinkManager.addBlinker(avatarVrm)
    setAvatarVrm(avatarVrm)
  }, [avatarVrm])


  useEffect(() => {
    if (!mixer || !mixamoClip) {
      return
    }
    customDebug().log('Avatar: call at once');
    mixer.timeScale = 1;
    mixer.clipAction(mixamoClip).play();
  }, [mixer, mixamoClip])


  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }
  })


  return avatarVrm && avatarVrm.scene && (
    <primitive
      object={avatarVrm.scene}
      position={avatarInitPos}
    />
  )
}

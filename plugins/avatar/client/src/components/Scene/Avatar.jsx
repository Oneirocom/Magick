import React, { useEffect, useState } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { useZustand } from '../../store/useZustand'
import { customDebug } from '../../utils/custom.debug'
import { useCallback } from 'react'


export const Avatar = () => {
  const { avatarInitPos } = useZustand()
  const [prevAction, setPrevAction] = useState(null)

  const gltf = useGLTF('/models/avatar2.vrm')
  customDebug().log('Avatar: gltf: ', gltf)

  const fbx = useFBX('/models/magic idle.fbx')
  customDebug().log('Avatar: fbx: ', fbx)

  const { ref, actions, mixer } = useAnimations(fbx.animations)
  customDebug().log('Avatar: ref: ', ref)
  customDebug().log('Avatar: actions: ', actions)
  customDebug().log('Avatar: mixer: ', mixer)

  const deactivateAllActions = useCallback(() => {
    Object.keys(actions).forEach((actionKey) => {
      actions[actionKey].stop()
    })
  }, [actions])

  const activateAllActions = useCallback(() => {
    Object.keys(actions).forEach((actionKey) => {
      actions[actionKey].play()
    })
  }, [actions])

  const unPauseAllActions = useCallback(() => {
    Object.keys(actions).forEach((actionKey) => {
      actions[actionKey].paused = false
    })
  }, [actions])

  const pauseAllActions = useCallback(() => {
    Object.keys(actions).forEach((actionKey) => {
      actions[actionKey].paused = true
    })
  }, [actions])

  const setAllWeight = useCallback((weight) => {
    Object.keys(actions).forEach((actionKey) => {
      setWeight(actions[actionKey], weight)
    })
  }, [actions])

  const setWeight = (action, weight) => {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }

  const executeCrossFade = useCallback((startAction, endAction, duration) => {
    setWeight(endAction, 1)
    endAction.time = 0
    if (startAction) {
      startAction.crossFadeTo(endAction, duration, true)
    }
  }, [])

  const synchronizeCrossFade = useCallback((startAction, endAction, duration) => {
    const onLoopFinished = (event) => {
      if (event.action === startAction || !startAction) {
        mixer.removeEventListener('loop', onLoopFinished)
        executeCrossFade(startAction, endAction, duration)
      }
    }

    mixer.addEventListener('loop', onLoopFinished)
  }, [executeCrossFade, mixer])

  const prepareCrossFade = useCallback((startAction, endAction, duration) => {
    unPauseAllActions()
    executeCrossFade(startAction, endAction, duration)
  }, [executeCrossFade, unPauseAllActions])

  const prepareSyncCrossFade = useCallback((startAction, endAction, duration) => {
    unPauseAllActions()
    synchronizeCrossFade(startAction, endAction, duration)
  }, [synchronizeCrossFade, unPauseAllActions])

  const playIdleAnimOnly = useCallback(() => {
    customDebug().log('Avatar#playIdleAnimOnly: actions: ', actions)
    const idleAction = actions['Idle']

    if (idleAction && prevAction !== idleAction) {
      prepareSyncCrossFade(prevAction, idleAction, 0.3)
      setPrevAction(idleAction)
    }
  }, [actions, prepareSyncCrossFade, prevAction])

  const playWalkAnimOnly = useCallback(() => {
    const walkAction = actions['Walk']

    if (walkAction && prevAction !== walkAction) {
      prepareCrossFade(prevAction, walkAction, 0)
      setPrevAction(walkAction)
    }
  }, [actions, prepareCrossFade, prevAction])

  // Call at once
  useEffect(() => {
    customDebug().log('Avatar: call at once')

    // Play idle animation at first
    // mixer.timeScale = 1
    // activateAllActions()
    // setAllWeight(0)
    // playIdleAnimOnly()
  }, [])

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      position={avatarInitPos}
    />
  )
}

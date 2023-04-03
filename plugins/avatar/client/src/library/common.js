import { tempEuler, tempQuat } from "./constants"

export const getTrackByName = (animationClip, name) => {
  const track = animationClip.tracks.find(track => track.name === name)
  return track
}

export const invertAnimTrack = (animTrack, axis, direc = 1) => {
  const luaqTrackTimeLen = animTrack.times.length

  for (let i = 0; i < luaqTrackTimeLen; i++) {
    const startIndex = i * 4
    const quat1 = tempQuat.clone().set(
      animTrack.values[startIndex],
      animTrack.values[startIndex + 1],
      animTrack.values[startIndex + 2],
      animTrack.values[startIndex + 3],
    )
    const euler = tempEuler.clone().setFromQuaternion(quat1)
    euler[axis] = direc * Math.abs(euler[axis])
    const quat2 = tempQuat.clone().setFromEuler(euler.clone())
    animTrack.values[startIndex] = quat2.x
    animTrack.values[startIndex + 1] = quat2.y
    animTrack.values[startIndex + 2] = quat2.z
    animTrack.values[startIndex + 3] = quat2.w
  }
}

export const invertAnim = (anim) => {
  // Left
  const luaqTrack = getTrackByName(anim, 'leftUpperArm.quaternion')
  invertAnimTrack(luaqTrack, 'z', 1)

  const llaqTrack = getTrackByName(anim, 'leftLowerArm.quaternion')
  invertAnimTrack(llaqTrack, 'x', -1)

  const lhTrack = getTrackByName(anim, 'leftHand.quaternion')
  invertAnimTrack(lhTrack, 'x', -1)

  const ltmTrack = getTrackByName(anim, 'leftThumbMetacarpal.quaternion')
  invertAnimTrack(ltmTrack, 'x', -1)
  const ltpTrack = getTrackByName(anim, 'leftThumbProximal.quaternion')
  invertAnimTrack(ltpTrack, 'y', 1)
  const ltdTrack = getTrackByName(anim, 'leftThumbDistal.quaternion')
  invertAnimTrack(ltdTrack, 'z', 1)

  const lipTrack = getTrackByName(anim, 'leftIndexProximal.quaternion')
  invertAnimTrack(lipTrack, 'z', 1)
  const liiTrack = getTrackByName(anim, 'leftIndexIntermediate.quaternion')
  invertAnimTrack(liiTrack, 'z', 1)
  const lidTrack = getTrackByName(anim, 'leftIndexDistal.quaternion')
  invertAnimTrack(lidTrack, 'z', 1)

  const lmpTrack = getTrackByName(anim, 'leftMiddleProximal.quaternion')
  invertAnimTrack(lmpTrack, 'z', 1)
  const lmiTrack = getTrackByName(anim, 'leftMiddleIntermediate.quaternion')
  invertAnimTrack(lmiTrack, 'z', 1)
  const lmdTrack = getTrackByName(anim, 'leftMiddleDistal.quaternion')
  invertAnimTrack(lmdTrack, 'z', 1)

  const lrpTrack = getTrackByName(anim, 'leftRingProximal.quaternion')
  invertAnimTrack(lrpTrack, 'z', 1)
  const lriTrack = getTrackByName(anim, 'leftRingIntermediate.quaternion')
  invertAnimTrack(lriTrack, 'z', 1)
  const lrdTrack = getTrackByName(anim, 'leftRingDistal.quaternion')
  invertAnimTrack(lrdTrack, 'z', 1)

  const llpTrack = getTrackByName(anim, 'leftLittleProximal.quaternion')
  invertAnimTrack(llpTrack, 'z', 1)
  const lliTrack = getTrackByName(anim, 'leftLittleIntermediate.quaternion')
  invertAnimTrack(lliTrack, 'z', 1)
  const lldTrack = getTrackByName(anim, 'leftLittleDistal.quaternion')
  invertAnimTrack(lldTrack, 'z', 1)

  // Right
  const ruaqTrack = getTrackByName(anim, 'rightUpperArm.quaternion')
  invertAnimTrack(ruaqTrack, 'z', -1)

  const rlaqTrack = getTrackByName(anim, 'rightLowerArm.quaternion')
  invertAnimTrack(rlaqTrack, 'x', 1)

  const rhTrack = getTrackByName(anim, 'rightHand.quaternion')
  invertAnimTrack(rhTrack, 'x', 1)

  const rtmTrack = getTrackByName(anim, 'rightThumbMetacarpal.quaternion')
  invertAnimTrack(rtmTrack, 'x', -1)
  const rtpTrack = getTrackByName(anim, 'rightThumbProximal.quaternion')
  invertAnimTrack(rtpTrack, 'y', -1)
  const rtdTrack = getTrackByName(anim, 'rightThumbDistal.quaternion')
  invertAnimTrack(rtdTrack, 'z', -1)

  const ripTrack = getTrackByName(anim, 'rightIndexProximal.quaternion')
  invertAnimTrack(ripTrack, 'z', -1)
  const riiTrack = getTrackByName(anim, 'rightIndexIntermediate.quaternion')
  invertAnimTrack(riiTrack, 'z', -1)
  const ridTrack = getTrackByName(anim, 'rightIndexDistal.quaternion')
  invertAnimTrack(ridTrack, 'z', -1)

  const rmpTrack = getTrackByName(anim, 'rightMiddleProximal.quaternion')
  invertAnimTrack(rmpTrack, 'z', -1)
  const rmiTrack = getTrackByName(anim, 'rightMiddleIntermediate.quaternion')
  invertAnimTrack(rmiTrack, 'z', -1)
  const rmdTrack = getTrackByName(anim, 'rightMiddleDistal.quaternion')
  invertAnimTrack(rmdTrack, 'z', -1)

  const rrpTrack = getTrackByName(anim, 'rightRingProximal.quaternion')
  invertAnimTrack(rrpTrack, 'z', -1)
  const rriTrack = getTrackByName(anim, 'rightRingIntermediate.quaternion')
  invertAnimTrack(rriTrack, 'z', -1)
  const rrdTrack = getTrackByName(anim, 'rightRingDistal.quaternion')
  invertAnimTrack(rrdTrack, 'z', -1)

  const rlpTrack = getTrackByName(anim, 'rightLittleProximal.quaternion')
  invertAnimTrack(rlpTrack, 'z', -1)
  const rliTrack = getTrackByName(anim, 'rightLittleIntermediate.quaternion')
  invertAnimTrack(rliTrack, 'z', -1)
  const rldTrack = getTrackByName(anim, 'rightLittleDistal.quaternion')
  invertAnimTrack(rldTrack, 'z', -1)
}

export const getCameraFovToFitScreen = (viewDistance, height) => {
  const cameraFov = 2 * Math.atan(height / (2 * viewDistance)) * (180 / Math.PI)
  return cameraFov
}

export const getBone = (model, name) => {
  const bone = model.humanoid.getBoneNode( name );
  return bone
}

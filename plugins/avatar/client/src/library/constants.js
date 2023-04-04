import * as THREE from 'three'

export const TRANSITION_TIME_OF_SWITCH_ITEM = 100;
export const TRANSITION_TIME_OF_LOADING_AVATAR = 100;

export const SWITCH_ITEM_EFFECT_INITIAL_TIME = 0.0;
export const SWITCH_ITEM_EFFECT_DURATION = 1.5;
export const SWITCH_ITEM_EFFECT_SPEED = 0.1;

export const FADE_OUT_AVATAR_INITIAL_TIME = 0.0;
export const FADE_OUT_AVATAR_DURATION = 1;
export const FADE_OUT_AVATAR_SPEED = 0.05;

export const FADE_IN_AVATAR_INITIAL_TIME = 0.0;
export const FADE_IN_AVATAR_DURATION = 1;
export const FADE_IN_AVATAR_SPEED = 0.015;

export const transitionEffectTypeNumber = {
  normal: 0,
  switchItem: 1,
  fadeOutAvatar: 2,
  loadingAvatar: 3,
  fadeInAvatar: 4,
}

export const tempVec2 = new THREE.Vector2()
export const tempVec3 = new THREE.Vector3()
export const tempQuat = new THREE.Quaternion()
export const tempEuler = new THREE.Euler()

export const tempColor = new THREE.Color()

export const CAMERA_TO_PLANE_DISTANCE = 1
export const PLANE_HEIGHT = CAMERA_TO_PLANE_DISTANCE / 2
export const PLANE_COLOR = '#ffff00'

export const raycaster = new THREE.Raycaster()

export const mixamoVRMRigMap = {
  'mixamorigHips': 'hips',
  'mixamorigSpine': 'spine',
  'mixamorigSpine1': 'chest',
  'mixamorigSpine2': 'upperChest',
  'mixamorigNeck': 'neck',
  'mixamorigHead': 'head',
  'mixamorigLeftShoulder': 'leftShoulder',
  'mixamorigLeftArm': 'leftUpperArm',
  'mixamorigLeftForeArm': 'leftLowerArm',
  'mixamorigLeftHand': 'leftHand',
  'mixamorigLeftHandThumb1': 'leftThumbProximal',
  'mixamorigLeftHandThumb2': 'leftThumbIntermediate',
  'mixamorigLeftHandThumb3': 'leftThumbDistal',
  'mixamorigLeftHandIndex1': 'leftIndexProximal',
  'mixamorigLeftHandIndex2': 'leftIndexIntermediate',
  'mixamorigLeftHandIndex3': 'leftIndexDistal',
  'mixamorigLeftHandMiddle1': 'leftMiddleProximal',
  'mixamorigLeftHandMiddle2': 'leftMiddleIntermediate',
  'mixamorigLeftHandMiddle3': 'leftMiddleDistal',
  'mixamorigLeftHandRing1': 'leftRingProximal',
  'mixamorigLeftHandRing2': 'leftRingIntermediate',
  'mixamorigLeftHandRing3': 'leftRingDistal',
  'mixamorigLeftHandPinky1': 'leftLittleProximal',
  'mixamorigLeftHandPinky2': 'leftLittleIntermediate',
  'mixamorigLeftHandPinky3': 'leftLittleDistal',
  'mixamorigRightShoulder': 'rightShoulder',
  'mixamorigRightArm': 'rightUpperArm',
  'mixamorigRightForeArm': 'rightLowerArm',
  'mixamorigRightHand': 'rightHand',
  'mixamorigRightHandPinky1': 'rightLittleProximal',
  'mixamorigRightHandPinky2': 'rightLittleIntermediate',
  'mixamorigRightHandPinky3': 'rightLittleDistal',
  'mixamorigRightHandRing1': 'rightRingProximal',
  'mixamorigRightHandRing2': 'rightRingIntermediate',
  'mixamorigRightHandRing3': 'rightRingDistal',
  'mixamorigRightHandMiddle1': 'rightMiddleProximal',
  'mixamorigRightHandMiddle2': 'rightMiddleIntermediate',
  'mixamorigRightHandMiddle3': 'rightMiddleDistal',
  'mixamorigRightHandIndex1': 'rightIndexProximal',
  'mixamorigRightHandIndex2': 'rightIndexIntermediate',
  'mixamorigRightHandIndex3': 'rightIndexDistal',
  'mixamorigRightHandThumb1': 'rightThumbProximal',
  'mixamorigRightHandThumb2': 'rightThumbIntermediate',
  'mixamorigRightHandThumb3': 'rightThumbDistal',
  'mixamorigLeftUpLeg': 'leftUpperLeg',
  'mixamorigLeftLeg': 'leftLowerLeg',
  'mixamorigLeftFoot': 'leftFoot',
  'mixamorigLeftToeBase': 'leftToes',
  'mixamorigRightUpLeg': 'rightUpperLeg',
  'mixamorigRightLeg': 'rightLowerLeg',
  'mixamorigRightFoot': 'rightFoot',
  'mixamorigRightToeBase': 'rightToes',
};

import { AVATAR_DES_POS, AVATAR_INIT_POS, CAMERA_DES_POS, CAMERA_INIT_POS } from '../utils/constants'


export const createSceneSlice = (set, get) => {
  return {
    /* Camera */

    cameraInitPos: CAMERA_INIT_POS,
    cameraDesPos: CAMERA_DES_POS,

    /* Avatar */

    avatarVrm: null,
    setAvatarVrm: (newAvatarVrm) => set(() => ({avatarVrm: newAvatarVrm})),
    avatarInitPos: AVATAR_INIT_POS,
    avatarDesPos: AVATAR_DES_POS,
  }
}

import { CAMERA_DES_POS, CAMERA_INIT_POS } from '../utils/constants'


export const createSceneSlice = (set, get) => {
  return {
    /* Camera */

    cameraInitPos: CAMERA_INIT_POS,
    cameraDesPos: CAMERA_DES_POS,
  }
}

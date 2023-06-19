import { useEffect, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import { DEFAULT_MODEL } from '../utils/constants'
import { useSnackbar } from 'notistack'

export const useVrm = (vrmUrl) => {
  const [vrm, setVrm] = useState(null)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    (async () => {
      let gltf;
      if (!vrmUrl) {
        return
      }

      //load vrm file
      try {
        gltf = await gltfLoader.loadAsync(vrmUrl)
      } catch (e) {
        //default vrm ( Ref! drag/drop model )
        enqueueSnackbar('Non standard avatar', {
          variant: 'error',
        })
        gltf = await gltfLoader.loadAsync(DEFAULT_MODEL)
      }

      //ignore vrm0 file
      if (!gltf || gltf.userData.vrm.lookAt.faceFront.z <= 0) {
        enqueueSnackbar('Only VRM1 avatar supported', {
          variant: 'error',
        })
        return
      }
      else if(vrmUrl !== DEFAULT_MODEL){
        enqueueSnackbar('New avatar loaded', {
          variant: 'success',
        })
      }

      //set avatar with new gltf tranform
      const newVrm = gltf.userData.vrm;
      VRMUtils.rotateVRM0(newVrm);
      setVrm(newVrm)
    })()
  }, [vrmUrl])

  return vrm
}

const gltfLoader = new GLTFLoader();
gltfLoader.register((parser) => new VRMLoaderPlugin(parser));
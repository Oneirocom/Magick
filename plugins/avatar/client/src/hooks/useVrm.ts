import { useEffect, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import { customDebug } from '../utils/custom.debug'

export const useVrm = (vrmUrl) => {
  const [vrm, setVrm] = useState(null)

  useEffect(() => {
    (async () => {
      if (!vrmUrl) {
        return
      }
      customDebug().log('useVrm#useEffect: vrmUrl: ', vrmUrl)
      const gltf = await gltfLoader.loadAsync(vrmUrl)
      const newVrm = gltf.userData.vrm; // VRMを制御するためのクラス `VRM` が `gltf.userData.vrm` に入っています
      VRMUtils.rotateVRM0(newVrm); // 読み込んだモデルがVRM0.0の場合は回す
      setVrm(newVrm)
    })()
  }, [vrmUrl])

  return vrm
}

const gltfLoader = new GLTFLoader(); // GLTFを読み込むLoader
gltfLoader.register((parser) => new VRMLoaderPlugin(parser)); // GLTFLoaderにVRMLoaderPluginをインストール

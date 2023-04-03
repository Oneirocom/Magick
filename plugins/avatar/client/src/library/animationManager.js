import { VectorKeyframeTrack, AnimationClip, QuaternionKeyframeTrack } from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { mixamoVRMRigMap } from './constants'
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm"
import * as THREE from 'three'
import { AnimationMixer } from 'three'

export function loadMixamoAnimation( url, vrm ) {
  const loader = new FBXLoader(); // FBXを読み込むLoader
  return loader.loadAsync( url ).then( ( asset ) => {
    const clip = AnimationClip.findByName( asset.animations, 'mixamo.com' ); // AnimationClipを抽出する

    const tracks = []; // VRM用のKeyframeTrackをこの配列に格納する

    clip.tracks.forEach( ( track ) => {
      // 各TrackをVRM向けに変換し、 `tracks` に格納する
      const trackSplitted = track.name.split( '.' );
      const mixamoRigName = trackSplitted[ 0 ];
      const vrmBoneName = mixamoVRMRigMap[ mixamoRigName ];
      const vrmNodeName = vrm.humanoid?.getBoneNode( vrmBoneName )?.name;
      
      if ( vrmNodeName != null ) {
        const propertyName = trackSplitted[ 1 ];

        if ( track instanceof QuaternionKeyframeTrack ) {
          tracks.push( new QuaternionKeyframeTrack(
            `${ vrmNodeName }.${ propertyName }`,
            track.times,
            track.values.map( ( v, i ) => (
              ( vrm.meta?.metaVersion === '0' && ( i % 2 ) === 0 ) ? -v : v
            ) ),
          ) );
        } else if ( track instanceof VectorKeyframeTrack ) {
          tracks.push( new VectorKeyframeTrack(
            `${ vrmNodeName }.${ propertyName }`,
            track.times,
            track.values.map( ( v, i ) => (
              ( ( vrm.meta?.metaVersion === '0' && ( i % 3 ) !== 1 ) ? -v : v ) * 0.01
            ) ),
          ) );
        }
      }
    } );
    
    return new AnimationClip( 'vrmAnimation', clip.duration, tracks );
  } );
}

export function loadVRM( modelUrl ) { // モデルを読み込む処理
  const loader = new GLTFLoader(); // GLTFを読み込むLoader
  
  loader.register( ( parser ) => new VRMLoaderPlugin( parser ) ); // GLTFLoaderにVRMLoaderPluginをインストール
  
  return loader.loadAsync( modelUrl ).then( ( gltf ) => {
    const vrm = gltf.userData.vrm; // VRMを制御するためのクラス `VRM` が `gltf.userData.vrm` に入っています
    
    VRMUtils.rotateVRM0( vrm ); // 読み込んだモデルがVRM0.0の場合は回す
    
    return vrm;
  } );
}

export async function initAnimationMixer (animationUrl, vrm) {
  const mixer = new AnimationMixer( vrm.scene );
  mixer.timeScale = 1;
  const clip = await loadMixamoAnimation( animationUrl, vrm );
  mixer.clipAction( clip ).play();
  
  const clock = new THREE.Clock();
  clock.start();
  return mixer
}
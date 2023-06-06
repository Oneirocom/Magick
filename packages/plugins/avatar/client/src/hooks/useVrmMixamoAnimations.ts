import { useEffect, useState } from 'react'
import { VectorKeyframeTrack, AnimationClip, AnimationMixer, QuaternionKeyframeTrack } from 'three'
import { mixamoVRMRigMap } from '../utils/constants'


export const useVrmMixamoAnimations = (vrm, mixamoAnimations, exceptionBoneNames = []) => {
  const [mixer, setMixer] = useState(null)
  const [mixamoClip, setMixamoClip] = useState(null)

  useEffect(() => {
    if (!vrm || !vrm.scene || !mixamoAnimations) {
      return
    }
    const newMixer = new AnimationMixer(vrm.scene);
    setMixer(newMixer)

    const clip = AnimationClip.findByName(mixamoAnimations, 'mixamo.com'); // AnimationClipを抽出する
    const tracks = []; // VRM用のKeyframeTrackをこの配列に格納する

    clip.tracks.forEach((track) => {
      // 各TrackをVRM向けに変換し、 `tracks` に格納する
      const trackSplitted = track.name.split('.');
      const mixamoRigName = trackSplitted[0];
      const vrmBoneName = mixamoVRMRigMap[mixamoRigName];
      if (exceptionBoneNames.indexOf(vrmBoneName) > -1) {
        return
      }
      const vrmBoneNode = vrm.humanoid?.getBoneNode(vrmBoneName)
      const vrmNodeName = vrmBoneNode?.name;

      if (vrmNodeName != null) {
        const propertyName = trackSplitted[1];

        if (track instanceof QuaternionKeyframeTrack) {
          tracks.push(new QuaternionKeyframeTrack(
            `${vrmNodeName}.${propertyName}`,
            track.times,
            track.values.map((v, i) => (
              (vrm.meta?.metaVersion === '0' && (i % 2) === 0) ? -v : v
            )),
          ));
        } else if (track instanceof VectorKeyframeTrack) {
          tracks.push(new VectorKeyframeTrack(
            `${vrmNodeName}.${propertyName}`,
            track.times,
            track.values.map((v, i) => (
              ((vrm.meta?.metaVersion === '0' && (i % 3) !== 1) ? -v : v) * 0.01
            )),
          ));
        }
      }
    });

    const newMixamoClip = new AnimationClip('vrmAnimation', clip.duration, tracks);
    setMixamoClip(newMixamoClip)
  }, [vrm, mixamoAnimations])


  return {
    mixer,
    mixamoClip,
  }
}

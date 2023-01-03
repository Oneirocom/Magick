// i really dont like this.  But three vrm, is super grumpy/.
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  VRM,
  VRMExpressionPresetName,
  VRMHumanBoneName,
  VRMLoaderPlugin,
  VRMUtils,
} from '@pixiv/three-vrm'
import { Object3D } from 'three'

/*

inspired by https://twitter.com/yeemachine/status/1414993821583118341

*/

function randomsomesuch() {
  return (Math.random() - 0.5) / 10
}

const Avatar = ({ speechUrl, pause, unpause }) => {
  const { scene, camera } = useThree()
  const gltf = useGLTF(`/avatar.vrm`)

  useEffect(() => {
    console.log('SPEECH URL', speechUrl)
  }, [speechUrl])

  // settings
  const talktime = true
  let mouththreshold = 10
  let mouthboost = 10
  let bodythreshold = 10
  let bodymotion = 10
  let expression = 80
  let expressionyay = 0
  let expressionoof = 0
  let expressionlimityay = 0.5
  let expressionlimitoof = 0.5
  let expressionease = 100
  let expressionintensity = 0.75
  let lookAtTarget

  const avatar = useRef<any | null>(null)

  useEffect(() => {
    if (gltf) {
      lookAtTarget = new Object3D()
      camera.add(lookAtTarget)

      const loader = new GLTFLoader()

      loader.register(parser => {
        return new VRMLoaderPlugin(parser)
      })

      loader.load(`/avatar.vrm`,
        gltf => {
          const vrm = gltf.userData.vrm

          // Disable frustum culling
          vrm.scene.traverse(obj => {
            obj.frustumCulled = false
          })

          VRMUtils.removeUnnecessaryVertices(gltf.scene)
          VRMUtils.removeUnnecessaryJoints(gltf.scene)

          VRMUtils.rotateVRM0(vrm)

          avatar.current = vrm

          if (!avatar || !avatar.current) return

          camera.position.set(0.0, 1, 1)
          vrm.lookAt.target = camera

          // vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Hips).rotation.y =
          //   Math.PI
          vrm.springBoneManager?.reset()

          // un-T-pose
          vrm.humanoid.getNormalizedBoneNode(
            VRMHumanBoneName.RightUpperArm
          ).rotation.z = 250

          vrm.humanoid.getNormalizedBoneNode(
            VRMHumanBoneName.RightLowerArm
          ).rotation.z = -0.2

          vrm.humanoid.getNormalizedBoneNode(
            VRMHumanBoneName.LeftUpperArm
          ).rotation.z = -250

          vrm.humanoid.getNormalizedBoneNode(
            VRMHumanBoneName.LeftLowerArm
          ).rotation.z = 0.2

          vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Head).rotation.x =
            randomsomesuch()
          vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Head).rotation.y =
            randomsomesuch()
          vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Head).rotation.z =
            randomsomesuch()

          vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Neck).rotation.x =
            randomsomesuch()
          vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Neck).rotation.y =
            randomsomesuch()
          vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Neck).rotation.z =
            randomsomesuch()

          vrm.humanoid.getNormalizedBoneNode(
            VRMHumanBoneName.Spine
          ).rotation.x = randomsomesuch()
          vrm.humanoid.getNormalizedBoneNode(
            VRMHumanBoneName.Spine
          ).rotation.y = randomsomesuch()
          vrm.humanoid.getNormalizedBoneNode(
            VRMHumanBoneName.Spine
          ).rotation.z = randomsomesuch()

          vrm.springBoneManager?.reset()

          function blink() {
            var blinktimeout = Math.floor(Math.random() * 250) + 50

            lookAtTarget.position.y =
              camera.position.y - camera.position.y * 2 + 1.25
            setTimeout(() => {
              avatar.current.expressionManager.setValue(
                VRMExpressionPresetName.BlinkLeft,
                0
              )
              avatar.current.expressionManager.setValue(
                VRMExpressionPresetName.BlinkRight,
                0
              )
            }, blinktimeout)

            avatar.current.expressionManager.setValue(
              VRMExpressionPresetName.BlinkLeft,
              1
            )
            avatar.current.expressionManager.setValue(
              VRMExpressionPresetName.BlinkRight,
              1
            )
          }

          ;(function loop() {
            var rand = Math.round(Math.random() * 10000) + 1000
            setTimeout(function () {
              blink()
              loop()
            }, rand)
          })()

          avatar.current = vrm
          scene.add(avatar.current.scene)
        }
      )
    }
  }, [scene, gltf, camera])

  const [lastUrl, setLastUrl] = useState<string | null>(null)

  useEffect(() => {
    console.log('SPEECH URL CHANGED', speechUrl)
    if (!speechUrl) return

    pause()

    const url = `${process.env.REACT_APP_FILE_SERVER_URL}/${speechUrl}`
    let interval

    // @ts-ignore
    const audioContext = new AudioContext() || new webkitAudioContext()

    // rewrite the xhr to use fetch
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => onDecoded(buffer))

    function onDecoded(buffer) {
      const source = audioContext.createBufferSource()
      const analyser = audioContext.createAnalyser()

      source.buffer = buffer
      source.connect(analyser)
      analyser.connect(audioContext.destination)

      source.start()

      const array = new Uint8Array(analyser.frequencyBinCount)

      interval = setInterval(function () {
        analyser.getByteFrequencyData(array)

        var values = 0

        var length = array.length
        for (var i = 0; i < length; i++) {
          values += array[i]
        }

        // audio in expressed as one number
        var average = values / length
        var inputvolume = average

        // audio in spectrum expressed as array
        // console.log(array.toString());
        // useful for mouth shape variance

        // move the interface slider

        // mic based / endless animations (do stuff)

        if (avatar.current != undefined) {
          const vrm = avatar.current as any
          if (talktime == true) {
            // todo: more vowelshapes
            var voweldamp = 53
            var vowelmin = 12
            if (inputvolume > mouththreshold * 2) {
              vrm.expressionManager.setValue(
                VRMExpressionPresetName.Aa,
                ((average - vowelmin) / voweldamp) * (mouthboost / 10)
              )
            } else {
              vrm.expressionManager.setValue(VRMExpressionPresetName.Aa, 0)
            }
          }

          // move body

          // todo: replace with ease-to-target behaviour
          var damping = 750 / (bodymotion / 10)
          var springback = 1.001

          if (average > 1 * bodythreshold) {
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Head
            ).rotation.x += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Head
            ).rotation.x /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Head
            ).rotation.y += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Head
            ).rotation.y /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Head
            ).rotation.z += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Head
            ).rotation.z /= springback

            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Neck
            ).rotation.x += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Neck
            ).rotation.x /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Neck
            ).rotation.y += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Neck
            ).rotation.y /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Neck
            ).rotation.z += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.Neck
            ).rotation.z /= springback

            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.UpperChest
            ).rotation.x += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.UpperChest
            ).rotation.x /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.UpperChest
            ).rotation.y += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.UpperChest
            ).rotation.y /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.UpperChest
            ).rotation.z += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.UpperChest
            ).rotation.z /= springback

            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.RightShoulder
            ).rotation.x += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.RightShoulder
            ).rotation.x /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.RightShoulder
            ).rotation.y += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.RightShoulder
            ).rotation.y /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.RightShoulder
            ).rotation.z += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.RightShoulder
            ).rotation.z /= springback

            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.LeftShoulder
            ).rotation.x += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.LeftShoulder
            ).rotation.x /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.LeftShoulder
            ).rotation.y += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.LeftShoulder
            ).rotation.y /= springback
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.LeftShoulder
            ).rotation.z += (Math.random() - 0.5) / damping
            vrm.humanoid.getNormalizedBoneNode(
              VRMHumanBoneName.LeftShoulder
            ).rotation.z /= springback
          }

          // yay/oof expression drift
          expressionyay += (Math.random() - 0.5) / expressionease
          if (expressionyay > expressionlimityay) {
            expressionyay = expressionlimityay
          }
          if (expressionyay < 0) {
            expressionyay = 0
          }
          vrm.expressionManager.setValue(
            VRMExpressionPresetName.Happy,
            expressionyay
          )
          expressionoof += (Math.random() - 0.5) / expressionease
          if (expressionoof > expressionlimitoof) {
            expressionoof = expressionlimitoof
          }
          if (expressionoof < 0) {
            expressionoof = 0
          }
          vrm.expressionManager.setValue(
            VRMExpressionPresetName.Angry,
            expressionoof
          )
        }
        // do something with the frequency data
      }, 10) // update the frequency data every 10 milliseconds

      source.onended = () => {
        clearInterval(interval)
        audioContext.close()
        unpause()
      }
    }

    return () => {
      if (audioContext.state !== 'closed') audioContext.close()
      clearInterval(interval)
    }
  }, [speechUrl])

  useFrame(({ clock }, delta) => {
    if (avatar.current) {
      avatar.current.update(delta)
    }
  })

  return null
}

const AvatarFrame = ({ speechUrl, pause, unpause }) => (
  <Canvas>
    <OrbitControls target={[0.0, 1.25, 0.0]} screenSpacePanning={true} />
    <directionalLight
      args={['0xFFFFFF']}
      position={[1.0, 1.0, 1.0]}
      intensity={0.3}
    />
    <ambientLight intensity={0.65} />
    <Avatar speechUrl={speechUrl} pause={pause} unpause={unpause} />
  </Canvas>
)

export default AvatarFrame

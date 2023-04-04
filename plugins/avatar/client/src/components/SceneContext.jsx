import React, { createContext, useState } from "react"
import * as THREE from "three"

export const SceneContext = createContext()

export const SceneProvider = (props) => {
  const initializeScene = () => {
    const scene = new THREE.Scene()
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // rotate the directional light to be a key light
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    return scene;
  }

  const [scene, setScene] = useState(initializeScene)

  const [model, setModel] = useState(new THREE.Object3D())
  const [camera, setCamera] = useState(null)

  const [selectedOptions, setSelectedOptions] = useState([])
  const [removeOption, setRemoveOption] = useState(false)
  const [awaitDisplay, setAwaitDisplay] = useState(false)

  const [avatar, _setAvatar] = useState(null)

  const [blinkManager, setBlinkManager] = useState(null)

  const [lipSync, setLipSync] = useState(null)

  const [isChangingWholeAvatar, setIsChangingWholeAvatar] = useState(false)

  const setAvatar = (state) => {
    _setAvatar(state)
  }

  return (
    <SceneContext.Provider
      value={{
        awaitDisplay,
        setAwaitDisplay,
        blinkManager,
        setBlinkManager,
        lipSync,
        setLipSync,
        scene,
        setScene,
        setSelectedOptions,
        selectedOptions,
        setRemoveOption,
        removeOption,
        model,
        setModel,
        camera,
        setCamera,
        avatar,
        setAvatar,
        initializeScene,
        isChangingWholeAvatar,
        setIsChangingWholeAvatar,
      }}
    >
      {props.children}
    </SceneContext.Provider>
  )
}

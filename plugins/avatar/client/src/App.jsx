/* eslint-disable no-unused-vars */
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import styles from "./App.module.css"
import Background from "./components/Background"
import Chat from "./components/Chat"
import DragDrop from "./components/drag-drop/DragDrop"
import Scene from "./components/Scene"
import { BlinkManager } from "./library/blinkManager"
import { LipSync } from "./library/lipsync"
import { SceneProvider } from "./components/SceneContext"

import { initAnimationMixer, loadVRM } from "./library/animationManager"

let isFirstRender = true
let characterIsChanged = false

const animationUrl = '/3d/magic idle.fbx';
const characterUrl = '/3d/avatar.vrm'

export default function App() {
  const [micEnabled, setMicEnabled] = React.useState(false)
  const [speechRecognition, setSpeechRecognition] = React.useState(false)
  const [hideUi, setHideUi] = useState(false)
  const [characterModel, setCharacterModel] = React.useState(null)
  const [lipSync, setLipSync] = React.useState(null)

  const timer = useRef(null)

  const  applyAnimation = async (animationUrl, vrm) => {
    const mixer = await initAnimationMixer(animationUrl, vrm)
    const clock = new THREE.Clock();
    clock.start();

    if (timer.current) {
      clearInterval(timer.current)
    }

    timer.current = setInterval(() => {
      const delta = clock.getDelta();
  
      if ( mixer ) {
        mixer.update( delta );
      }
    
      if ( characterModel ) {
        characterModel.update( delta );
      }
    }, 1000 / 30);
  }
  
  useEffect(() => {
    if (!isFirstRender) return
    isFirstRender = false;
    (async () => {
      const vrm = await loadVRM(characterUrl)
      characterIsChanged = true
      
      await applyAnimation(animationUrl, vrm)
      setCharacterModel(vrm)
    })()
  }, [])


  // Update character model third-party library integrations
  useEffect(() => {
    if (!characterIsChanged || !characterModel) return
    console.log('character is changed')
    characterIsChanged = false;
    (async () => {
      const blinkManager = new BlinkManager(0.1, 0.1, 0.5, 5)
      blinkManager.addBlinker(characterModel)
      const newLipSync = new LipSync(characterModel)
      setLipSync(newLipSync)
    })()
  }, [characterModel])

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    (async () => {
      const reader = new FileReader();
      const obj = URL.createObjectURL(file)
      const characterModel = await loadVRM(obj)
      characterIsChanged = true
      await applyAnimation(animationUrl, characterModel)
      setCharacterModel(characterModel);
    })()
  }, []);

  let lastTap = 0

  useEffect(() => {
    const handleTap = (e) => {
      const now = new Date().getTime()
      const timesince = now - lastTap
      if (timesince < 300 && timesince > 10) {
        const tgt = e.target
        if (tgt.id == "editor-scene") setHideUi(!hideUi)
      }
      lastTap = now
    }
    window.addEventListener("touchend", handleTap)
    window.addEventListener("click", handleTap)
    return () => {
      window.removeEventListener("touchend", handleTap)
      window.removeEventListener("click", handleTap)
    }
  }, [hideUi])


  return (
    <SceneProvider>
      <DragDrop onDrop={onDrop} className={styles.dragdrop} noClick={false} />
      <Background />
      {characterModel && <Scene
        characterModel={characterModel}
      />}
      <div className={styles.container}>
        <div className={styles.chatContainer}>
          <div className={styles.scrollContainer}>
            <Chat
              micEnabled={micEnabled}
              setMicEnabled={setMicEnabled}
              speechRecognition={speechRecognition}
              setSpeechRecognition={setSpeechRecognition}
              lipSync={lipSync}
            />
          </div>
        </div>
      </div>
    </SceneProvider>
  )
}

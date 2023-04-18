/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from 'react-redux'
import * as THREE from 'three'
import styles from "./App.module.css"
import Background from "./components/Background"
import Chat from "./components/Chat"
import DragDrop from "./components/drag-drop/DragDrop"
import Scene from "./components/Scene"
import { SceneProvider } from "./components/SceneContext"
import { BlinkManager } from "./library/blinkManager"
import { LipSync } from "./library/lipsync"
import { useConfig } from '../../../../packages/editor/src/contexts/ConfigProvider'
import { initAnimationMixer, loadVRM } from "./library/animationManager"
import { IGNORE_AUTH, pluginManager } from '../../../../packages/core/shared/src'

let isFirstRender = true
let characterIsChanged = false

const animationUrl = '/3d/magic idle.fbx';
const characterUrl = '/3d/avatar.vrm'
let dropfile;

export default function App() {
  const [micEnabled, setMicEnabled] = React.useState(false)
  const [speechRecognition, setSpeechRecognition] = React.useState(false)
  const [hideUi, setHideUi] = useState(false)
  const [characterModel, setCharacterModel] = React.useState(null)
  const [lipSync, setLipSync] = React.useState(null)
  const [spellList, setSpellList] = React.useState([])

  const timer = useRef(null)
  const config = useConfig()
  const globalConfig = useSelector((state) => state.globalConfig)
  const token = globalConfig?.token
  const headers = IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` }

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
    isFirstRender = false;
    (async () => {
      let vrm;

      if(dropfile) {
        vrm = await loadVRM(dropfile)
      }
      else  vrm = await loadVRM(characterUrl)
      
      characterIsChanged = true
      
      await applyAnimation(animationUrl, vrm)
      setCharacterModel(vrm)
    })()
  }, [])

  // Update character model third-party library integrations
  useEffect(() => {
    if (!characterIsChanged || !characterModel) return
     
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
      dropfile = obj;
      const characterModel = await loadVRM(obj)
      characterIsChanged = true
      await applyAnimation(animationUrl, characterModel)
      setCharacterModel(characterModel);
    })()
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${config.apiUrl}/spells?projectId=${config.projectId}`,
        { headers }
      )
      const json = await res.json()

      setSpellList(json.data)
    })()
  }, [])

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
            <div className="form-item agent-select">
              <span className={styles.spellListTitle}>Root Spell</span>
              <select
                className={styles.spellSelector}
                name="spellList"
                id="spellList"
              >
                <option disabled value={'default'}>
                  Select Spell
                </option>
                {spellList?.length > 0 &&
                  spellList.map((spell, idx) => {
                    return (
                      <option value={spell.name} key={idx}>
                        {spell.name}
                      </option>
                    )
                  })}
              </select>
            </div>
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

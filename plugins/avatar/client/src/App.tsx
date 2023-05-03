import { useCallback, useEffect, useState, useFrame } from "react"
import { useFBX } from '@react-three/drei'
import { useVrm } from './hooks/useVrm'
import { customDebug } from "./utils/custom.debug"
import { Scene } from './components/Scene/Scene'
import DragDrop from './components/DragDrop/DragDrop'
import ChatBox from './components/Chat/ChatBox'
import { useZustand } from "./store/useZustand"
import styles from './App.module.css'
import { Sxp } from "./components/Sxp/Sxp"

const App = () => {

  const {
    setAvatarVrm,
  } = useZustand()

  const [vrmURL, setVrmUrl] = useState('/models/avatar2.vrm')

  const fbx = useFBX('/models/magic idle.fbx')

  const avatar = useVrm(vrmURL)
  
  // customDebug().log('Avatar: ', avatar)
  // customDebug().log('vrmURL: ', vrmURL)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    setVrmUrl(URL.createObjectURL(file))
  }, []);

  useEffect(()=>{
    setAvatarVrm(avatar)
  }, [avatar])

  return (
    <div className={styles.container}>
      <DragDrop onDrop={onDrop} className={styles.dragdrop} noClick={false}/>
      <Scene />
      <ChatBox />
      <Sxp />
    </div>
  )
}

export default App

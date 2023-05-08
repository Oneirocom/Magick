import { useCallback, useEffect, useState } from 'react'
import styles from './App.module.css'
import ChatBox from './components/Chat/ChatBox'
import DragDrop from './components/DragDrop/DragDrop'
import { Scene } from './components/Scene/Scene'
import { Sxp } from './components/Sxp/Sxp'
import { useVrm } from './hooks/useVrm'
import { useZustand } from './store/useZustand'

const App = () => {
  const { setAvatarVrm } = useZustand()

  const [vrmURL, setVrmUrl] = useState('/models/avatar2.vrm')

  const avatar = useVrm(vrmURL)

  // customDebug().log('Avatar: ', avatar)
  // customDebug().log('vrmURL: ', vrmURL)

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    if (!file) return
    setVrmUrl(URL.createObjectURL(file))
  }, [])

  useEffect(() => {
    setAvatarVrm(avatar)
  }, [avatar])

  return (
    <div className={styles.container}>
      <DragDrop onDrop={onDrop} className={styles.dragdrop} noClick={false} />
      <Scene />
      <ChatBox />
      <Sxp />
    </div>
  )
}

export default App

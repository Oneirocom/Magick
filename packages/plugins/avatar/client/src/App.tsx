import styles from './App.module.css'
import ChatBox from './components/Chat/ChatBox'
import { Scene } from './components/Scene/Scene'
import { Sxp } from './components/Sxp/Sxp'
import { useDropzone } from "react-dropzone"
import { useVrm } from './hooks/useVrm'
import { useCallback, useEffect, useState } from 'react'
import { useZustand } from './store/useZustand'

const App = () => {

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    if (!file) return
    setVrmUrl(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const [vrmURL, setVrmUrl] = useState('/models/avatar2.vrm')
  const avatar = useVrm(vrmURL)
  const { setAvatarVrm } = useZustand()

  useEffect(() => {
    setAvatarVrm(avatar)
  }, [avatar])

  return (
    <div className={styles.container} {...getRootProps()}>
      <input className={styles["input-zone"]} {...getInputProps()} />
      <Scene />
      <ChatBox />
      <Sxp />
    </div>
  )
}

export default App

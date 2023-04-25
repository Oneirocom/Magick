import React from 'react'
import { Scene } from './components/Scene/Scene'
import styles from './App.module.css'
import ChatBox from './components/Chat/ChatBox'

const App = () => {
  return (
    <div className={styles.container}>
      <Scene />
      <ChatBox />
    </div>
  )
}


export default App

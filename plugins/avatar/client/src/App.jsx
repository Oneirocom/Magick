import styles from './App.module.css'
import ChatBox from './components/Chat/ChatBox'
import { Scene } from './components/Scene/Scene'

const App = () => {
  return (
    <div className={styles.container}>
      <Scene />
      <ChatBox />
    </div>
  )
}


export default App

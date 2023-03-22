import { useConfig } from '../../contexts/ConfigProvider'

const DatabaseWindow = () => {
  const config = useConfig()

  return (
    <div className="project-container" style={{paddingBottom: "1em", width: "100%", height: "100vh", "overflow": "scroll"}}>
      Project
    </div>
  )
}

export default DatabaseWindow

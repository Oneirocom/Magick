import { DEFAULT_PROJECT_ID } from '@magickml/engine'
import { useContext, createContext, useState } from 'react'

export type AppConfig = {
  apiUrl: string
  projectId: string
  token: string
}

export interface ConfigContext {
  apiUrl: string
  setApiUrl: (url: string) => void
  projectId: string
  setProjectId: (id: string) => void
}

const Context = createContext<ConfigContext>(undefined!)

export const useConfig = () => useContext(Context)

export const defaultConfig: AppConfig = {
  // add props here
  apiUrl: 'http://localhost:3030',
  projectId: DEFAULT_PROJECT_ID,
  token: '',
}

// Might want to namespace these
const ConfigProvider = ({ config = defaultConfig, children }) => {
  const [apiUrl, setApiUrl] = useState<ConfigContext['apiUrl']>(config.apiUrl)
  const [projectId, setProjectId] = useState<ConfigContext['projectId']>(
    config.projectId
  )

  const publicInterface: ConfigContext = {
    apiUrl,
    setApiUrl,
    projectId,
    setProjectId,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  return <ConfigProvider {...props} />
}

export default ConditionalProvider

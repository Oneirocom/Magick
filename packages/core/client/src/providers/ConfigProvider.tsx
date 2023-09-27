// DOCUMENTED
// Import required dependencies
import { DEFAULT_PROJECT_ID } from 'shared/config'
import { createContext, useContext, useState } from 'react'

// Define AppConfig type
export type AppConfig = {
  apiUrl: string
  projectId: string
  token: string
  posthogEnabled?: boolean
}

// Define ConfigContext interface
export interface ConfigContext {
  apiUrl: string
  setApiUrl: (url: string) => void
  projectId: string
  setProjectId: (id: string) => void
}

// Create context for ConfigContext
const Context = createContext<ConfigContext>(undefined!)

/**
 * Custom hook to use the config context
 */
export const useConfig = () => useContext(Context)

/**
 * Default AppConfig
 */
export const defaultConfig: AppConfig = {
  apiUrl: 'http://localhost:3030',
  projectId: DEFAULT_PROJECT_ID,
  token: '',
}

/**
 * ConfigProvider component that handles global configuration
 */
export const ConfigProvider = ({ config = defaultConfig, children }) => {
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

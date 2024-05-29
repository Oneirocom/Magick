// DOCUMENTED
// Import required dependencies
import { DEFAULT_PROJECT_ID } from 'clientConfig'
import { createContext, useContext, useState } from 'react'
import { ProviderData } from 'servicesShared'
import { embedderTokenAtom } from 'window-knowledge'
import { useSetAtom } from 'jotai'

// Define AppConfig type
export type AppConfig = {
  apiUrl: string
  projectId: string
  token: string
  userId: string
  posthogEnabled?: boolean
  email: string | undefined
  providerData: ProviderData
  embedderToken: string
}

// Define ConfigContext interface
export interface ConfigContext {
  apiUrl: string
  setApiUrl: (url: string) => void
  projectId: string
  setProjectId: (id: string) => void
  providerData: ProviderData
  setProviderData: (providerData: ProviderData) => void
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
  userId: '',
  email: undefined,
  providerData: {},
  embedderToken: '',
}

/**
 * ConfigProvider component that handles global configuration
 */
export const ConfigProvider = ({ config = defaultConfig, children }) => {
  const [apiUrl, setApiUrl] = useState<ConfigContext['apiUrl']>(config.apiUrl)
  const [projectId, setProjectId] = useState<ConfigContext['projectId']>(
    config.projectId
  )
  const [providerData, setProviderData] = useState<
    ConfigContext['providerData']
  >(config.providerData)

  const setEmbedderToken = useSetAtom(embedderTokenAtom)
  setEmbedderToken(config.embedderToken)

  const publicInterface: ConfigContext = {
    apiUrl,
    setApiUrl,
    projectId,
    setProjectId,
    providerData,
    setProviderData,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

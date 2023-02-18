import { useContext, createContext, useState } from 'react'

export type AppConfig = {
  apiUrl: string
}

export interface ConfigContext {
  apiUrl: string
  setApiUrl: (url: string) => void
}

const Context = createContext<ConfigContext>(undefined!)

export const useConfig = () => useContext(Context)

export const defaultConfig: AppConfig = {
  // add props here
  apiUrl: 'http://localhost:3030',
}

// Might want to namespace these
const ConfigProvider = ({ config = defaultConfig, children }) => {
  const [apiUrl, setApiUrl] = useState<ConfigContext['apiUrl']>(config.apiUrl)

  const publicInterface: ConfigContext = {
    apiUrl,
    setApiUrl,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  return <ConfigProvider {...props} />
}

export default ConditionalProvider

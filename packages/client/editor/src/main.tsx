// DOCUMENTED
/**
 * A module which exports a functional component - MagickIDE
 * @module MagickIDE
 */
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import 'regenerator-runtime/runtime'

import App from './App'
import AppProviders from './contexts/AppProviders'
import { AppConfig } from '@magickml/providers'
import { MagickmlChatbox } from 'client/magickml-chatbox'
import { createStore } from 'client/state'
import { feathersClient } from 'client/feathers-client'

import './styles/themes.scss'

/**
 * Type definition for the props that can be passed to MagickIDE
 * @typedef {Object} MagickIDEProps
 * @property {AppConfig} config - configuration object for the app
 */
export type MagickIDEProps = {
  config: AppConfig
}

/**
 * A functional component that renders the main body of the MagickIDE application
 * @param {MagickIDEProps} props - A plain object representing the props passed to the component.
 * @returns {React.ReactElement} - A React component
 */
export const MagickIDE = ({ config }: MagickIDEProps): React.ReactElement => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    (async () => {
      await feathersClient.initialize(config.token, config)
      setLoaded(true)
    })()
  })


  if (!loaded) return null

  return (
    <Router>
      <Provider store={createStore(config)}>
        <AppProviders config={config}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
            <MagickmlChatbox />
          </LocalizationProvider>
        </AppProviders>
      </Provider>
    </Router>
  )
}

export default MagickIDE

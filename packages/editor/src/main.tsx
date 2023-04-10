// DOCUMENTED
/**
 * A module which exports a functional component - MagickIDE
 * @module MagickIDE
 */
import React from 'react'

import './wdyr'
import 'regenerator-runtime/runtime'
import { Provider } from 'react-redux'
import { WagmiConfig } from 'wagmi'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import { client } from './wagmi'
import AppProviders from './contexts/AppProviders'
import { createStore } from './state/store'

import { AppConfig } from './contexts/ConfigProvider'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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
  return (
    <Router>
      <Provider store={createStore(config)}>
        <AppProviders config={config}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <WagmiConfig client={client}>
              <App />
            </WagmiConfig>
          </LocalizationProvider>
        </AppProviders>
      </Provider>
    </Router>
  )
}

export default MagickIDE

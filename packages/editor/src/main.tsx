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

export type MagickIDEProps = AppConfig

export const MagickIDE = ({ config }: { config: MagickIDEProps }) => {
  return (
    <Router>
      <Provider store={createStore(config)}>
        <AppProviders config={config}>
          <WagmiConfig client={client}>
            <App />
          </WagmiConfig>
        </AppProviders>
      </Provider>
    </Router>
  )
}

export default MagickIDE

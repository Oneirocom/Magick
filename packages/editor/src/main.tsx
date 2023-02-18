import React, { useState } from 'react'

import './wdyr'
import 'regenerator-runtime/runtime'
import { Provider } from 'react-redux'
import { WagmiConfig } from 'wagmi'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import { client } from './wagmi'
import AppProviders from './contexts/AppProviders'
import { getOrCreateStore } from './state/store'

import { AppConfig } from './contexts/ConfigProvider'

export type MagickIDEProps = {
  config: AppConfig
}

export const MagickIDE = ({
  config,
}: MagickIDEProps) => {
  const [store, _] = useState(getOrCreateStore(config));
  if(!config || !store) return (<div>Error, check your config...</div>)
  return (
  <Router>
    <Provider store={store}>
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
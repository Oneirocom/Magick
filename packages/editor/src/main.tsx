import React, { useEffect, useState } from 'react'

import './wdyr'
import 'regenerator-runtime/runtime'
import { Provider } from 'react-redux'
import { WagmiConfig } from 'wagmi'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import { client } from './wagmi'
import AppProviders from './contexts/AppProviders'
import { getStore } from './state/store'

import { AppConfig } from './contexts/ConfigProvider'

export type MagickIDEProps = AppConfig

export const MagickIDE = ({
  config,
}: { config: MagickIDEProps }) => {
  const [store, _] = useState(getStore(config));
  return (
  <Router>
    <Provider store={store}>
      <AppProviders config={config}>
          <App />
      </AppProviders>
    </Provider>
  </Router>
)
  }

export default MagickIDE
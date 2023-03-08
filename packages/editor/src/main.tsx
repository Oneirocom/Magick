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
  token,
}: {
  config: MagickIDEProps
  token: string
}) => {
  const [store] = useState(getStore(config, token))
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

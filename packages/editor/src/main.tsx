import React from 'react'

import './wdyr'
import 'regenerator-runtime/runtime'
import { Provider } from 'react-redux'
import { WagmiConfig } from 'wagmi'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import { client } from './wagmi'
import AppProviders from './contexts/AppProviders'
import { store } from './state/store'

const MagickIDE = () => (
  <Router>
    <Provider store={store}>
      <AppProviders>
        <WagmiConfig client={client}>
          <App />
        </WagmiConfig>
      </AppProviders>
    </Provider>
  </Router>
)

export default MagickIDE
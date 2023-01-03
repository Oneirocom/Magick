import './wdyr'
import 'regenerator-runtime/runtime'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import AppProviders from './contexts/AppProviders'
import reportWebVitals from './reportWebVitals'
import { store } from './state/store'

const container = document.getElementById('root')

const root = createRoot(container!) // createRoot(container!) if you use TypeScript

const Root = () => (
  <Router>
    <Provider store={store}>
      <AppProviders>
        <App />
      </AppProviders>
    </Provider>
  </Router>
)

root.render(<Root />)
reportWebVitals()

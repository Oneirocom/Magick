import './wdyr'
import 'regenerator-runtime/runtime'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { WagmiConfig } from 'wagmi'
import { BrowserRouter as Router } from 'react-router-dom'
console.log('Running root!')

import App from './App'
import { client } from './wagmi'
import AppProviders from './contexts/AppProviders'
import { store } from './state/store'

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
;(window as any).root = root
const Root = () => (
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

root.render(<Root />)

import {
  createTheme,
  ThemeProvider,
  Theme,
  adaptV4Theme,
} from '@mui/material/styles'

import FeathersProvider from './FeathersProvider'
import PubSubProvider from './PubSubProvider'
import ToastProvider from './ToastProvider'
import Account from '../screens/FineTuneManager/account/Account'

const darkTheme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'dark',
    },
  })
)

const providers = [
  PubSubProvider,
  [ThemeProvider, { theme: darkTheme }],
  ToastProvider,
  FeathersProvider,
  Account,
]

/**
 * Provided that a list of providers [P1, P2, P3, P4] is passed as props,
 * it renders
 *
 *    <P1>
        <P2>
          <P3>
            <P4>
              {children}
            </P4>
          </P3>
        </P2>
      </P1>
 *
 */

function ComposeProviders({ providers, children }) {
  const _providers = [...providers].reverse()
  return _providers.reduce((acc, current) => {
    const [Provider, props] = Array.isArray(current)
      ? [current[0], current[1]]
      : [current, {}]

    return <Provider {...props}>{acc}</Provider>
  }, children)
}

// Centralize all our providers to avoid nesting hell.
const AppProviders = ({ children }) => (
  <ComposeProviders providers={providers}>{children}</ComposeProviders>
)

export default AppProviders

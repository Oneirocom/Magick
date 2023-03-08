import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material'

import ConfigProvider from './ConfigProvider'
import FeathersProvider from './FeathersProvider'
import PubSubProvider from './PubSubProvider'
import ToastProvider from './ToastProvider'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

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

function ComposeProviders({ config, children, token }) {
  const _providers = [
    [ConfigProvider, { config }],
    [ThemeProvider, { theme: darkTheme }],
    [FeathersProvider, { token }],
    PubSubProvider,
    ToastProvider,
  ].reverse()
  return _providers.reduce((acc, current) => {
    const [Provider, props]: [any, any] = Array.isArray(current)
      ? [current[0], current[1]]
      : [current, {}]

    return <Provider {...props}>{acc}</Provider>
  }, children)
}

// Centralize all our providers to avoid nesting hell.
const AppProviders = ({ config, children, token }) => (
  <ComposeProviders config={config} token={token}>
    {children}
  </ComposeProviders>
)

export default AppProviders

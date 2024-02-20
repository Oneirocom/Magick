// DOCUMENTED
import { ConfigProvider, FeathersProvider, PubSubProvider } from '@magickml/providers'
import { createTheme, ThemeProvider } from '@mui/material'
import ToastProvider from './ToastProvider'
import { TabProvider } from '@magickml/providers';
import { GlobalLayoutProvider } from './GlobalLayoutProvider'

// Create a dark theme for the application
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

/**
 * Renders a list of providers composed together.
 * @param {Object} param0 -
 * @param {Object} param0.config - Configuration options for providers.
 * @param {React.ReactNode} param0.children - Children elements to render within the composed providers.
 */
function ComposeProviders({ config, children }) {
  // Providers with their respective props
  const _providers = [
    [ConfigProvider, { config }],
    [ThemeProvider, { theme: darkTheme }],
    [FeathersProvider, { token: config.token }],
    PubSubProvider,
    [ToastProvider, { autoHideDuration: 3000 }],
    GlobalLayoutProvider,
    TabProvider,
  ].reverse()

  // Compose providers together and pass the props for each provider
  return _providers.reduce((acc, current) => {
    const [Provider, props]: [any, any] = Array.isArray(current)
      ? [current[0], current[1]]
      : [current, {}]

    return <Provider {...props}>{acc}</Provider>
  }, children)
}

/**
 * Centralizes all providers for the application to avoid nesting hell.
 * @param {Object} param0 -
 * @param {Object} param0.config - Configuration options for providers.
 * @param {React.ReactNode} param0.children - Children elements to render within the composed providers.
 */
const AppProviders = ({ config, children }) => (
  <ComposeProviders config={config}>{children}</ComposeProviders>
)

export default AppProviders

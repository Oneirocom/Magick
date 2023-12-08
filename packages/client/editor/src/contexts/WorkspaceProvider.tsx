// DOCUMENTED
import EditorProvider from './EditorProvider'
import MagickInterfaceProvider from './MagickInterfaceProvider'
import InspectorProvider from './InspectorProvider'
import { ReactFlowProvider } from 'reactflow'

/** An array of providers used in the application */
const providers = [
  ReactFlowProvider,
  MagickInterfaceProvider,
  EditorProvider,
  InspectorProvider,
]

/**
 * Composes providers for react application
 * @param {Object} params - Parameters object
 * @param {Array} params.providers - Array of provider components
 * @param {React.ReactNode} params.children - Child components
 * @param {Object} params.parentProps - Parent components properties
 */
function ComposeProviders({ providers, children, ...parentProps }) {
  const _providers = [...providers].reverse()

  return _providers.reduce((acc, current) => {
    const [Provider, props] = Array.isArray(current)
      ? [current[0], current[1]]
      : [current, {}]

    const componentProps = {
      ...props,
      ...parentProps,
    }

    return <Provider {...componentProps}>{acc}</Provider>
  }, children)
}

/**
 * Workspace providers components which avoid nesting hell and centralize all providers
 * @param {Object} params - Parameters object
 * @param {React.ReactNode} params.children - Child components
 * @param {Object} params.props - Additional properties
 * @returns {JSX.Element} Composed providers and their children
 */
const WorkspaceProvider = ({ children, ...props }) => (
  <ComposeProviders providers={providers} {...props}>
    {children}
  </ComposeProviders>
)

export default WorkspaceProvider

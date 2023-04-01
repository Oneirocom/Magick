import EditorProvider from './EditorProvider'
import LayoutProvider from './LayoutProvider'
import MagickInterfaceProvider from './MagickInterfaceProvider'
import InspectorProvider from './InspectorProvider'

const providers = [
  MagickInterfaceProvider,
  EditorProvider,
  LayoutProvider,
  InspectorProvider,
]

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

// Centralize all our providers to avoid nesting hell.
const WorkspaceProvider = ({ children, ...props }) => (
  <ComposeProviders providers={providers} {...props}>
    {children}
  </ComposeProviders>
)

export default WorkspaceProvider

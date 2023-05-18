// DOCUMENTED
import { Window } from '@magickml/client-core'

import WindowMessage from '../components/WindowMessage'
import { useInspector } from '../contexts/InspectorProvider'

/**
 * The Inspector component displays the selected component's data in a window with controls for modifying the data.
 */
const AgentControls = props => {
  const toolbar = (
    <>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}></div>
    </>
  )

  return (
    <Window toolbar={toolbar} darker outline borderless>
      <div style={{ padding: 15 }}>
        <h1>Agent stuff here</h1>
      </div>
    </Window>
  )
}

export default AgentControls

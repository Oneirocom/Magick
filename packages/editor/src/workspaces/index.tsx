import WorkspaceProvider from './contexts/WorkspaceProvider'
import Composer from './spells'

// TODO create a proper workspace component that can take in everything we need it to
// for a standalone workspace environment.  Factor, events, etc.
// Workspace should register events with the events provider, etc.
const workspaceMap = {
  spell: Composer,
  module: Composer,
}

const Workspaces = ({ tabs, pubSub, activeTab }) => {
  return (
    <>
      {tabs.map(tab => {
        //TODO use a tab.fileType instead of tab.type
        // this will allow us to begin to expand towards a file base approach to the application.
        const Workspace = workspaceMap[tab.type]

        const props = {
          tabs,
          pubSub,
          tab,
        }

        return (
          <div
            key={tab.name}
            style={{
              visibility: tab.id !== activeTab.id ? 'hidden' : undefined,
              height: '100%',
            }}
          >
            <WorkspaceProvider {...props}>
              <Workspace {...props} />
            </WorkspaceProvider>
          </div>
        )
      })}
    </>
  )
}

export default Workspaces

// DOCUMENTED 
import WorkspaceProvider from '../contexts/WorkspaceProvider';
import Composer from './Workspace';

/**
 * A mapping of workspace types to their respective components.
 */
const workspaceMap = {
  spell: Composer,
  module: Composer,
};

/**
 * The Workspaces component displays a collection of workspaces, only showing the active one.
 *
 * @param tabs - An array of tabs.
 * @param pubSub - An instance of a publish-subscribe pattern.
 * @param activeTab - An object representing the active tab.
 * @returns A JSX element containing the active workspace.
 */
const Workspaces = ({ tabs, pubSub, activeTab }) => {
  return (
    <>
      {tabs.map((tab) => {
        if (tab.type === "component") {
          return null;
        }
        const Workspace = workspaceMap[tab.type];

        const props = {
          tabs,
          pubSub,
          tab,
        };

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
        );
      })}
    </>
  );
};


export default Workspaces;
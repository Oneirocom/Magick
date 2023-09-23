// DOCUMENTED 
import { memo, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import WorkspaceProvider from '../contexts/WorkspaceProvider';
import Composer from './Workspace';
import { Tab } from '@magickml/state';

/**
 * A mapping of workspace types to their respective components.
 */
const workspaceMap = {
  spell: Composer,
  module: Composer,
};

type WorkspaceProps = {
  pubSub: any;  // You might want to provide a more detailed type based on your usage.
  tab: Tab
};

const WorkspaceComponent = ({ tab, pubSub, activeTabId }) => {
  // const { active, ...tabWithoutActive } = tab;
  const Workspace = workspaceMap[tab.type];
  const props = {
    pubSub,
    tab
  };

  if (!Workspace) {
    return null;
  }

  return (
    <div
      key={tab.name}
      style={{
        visibility: tab.id !== activeTabId ? 'hidden' : undefined,
        height: '100%',
      }}
    >
      <WorkspaceProvider {...props}>
        <Workspace {...props} />;
      </WorkspaceProvider>
    </div>
  )
}

const Workspaces = ({ tabs, pubSub, activeTabId }) => {

  return (
    <>
      {tabs.map((tab) => {
        console.log("TAB!", tab)
        return <WorkspaceComponent key={tab.id} tab={tab} pubSub={pubSub} activeTabId={activeTabId} />;
      })}
    </>
  );
};

export default Workspaces;
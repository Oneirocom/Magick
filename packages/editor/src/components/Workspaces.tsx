// DOCUMENTED 
import { memo, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import WorkspaceProvider from '../contexts/WorkspaceProvider';
import { ClientPluginManager, pluginManager } from '@magickml/core'
import Composer from './Workspace';
import { Tab } from '@magickml/state';
import Events from '../screens/EventWindow'
import Requests from '../screens/RequestWindow'
import Settings from '../screens/settings/SettingsWindow'
import Documents from '../screens/DocumentWindow'
import Agents from '../screens/agents/AgentManagerWindow';


type WorkspaceProps = {
  pubSub: any;  // You might want to provide a more detailed type based on your usage.
  tab: Tab
};

const WorkspaceComponent = ({ tab, pubSub, activeTabId }) => {
  const pluginComponents = []

    ; (pluginManager as ClientPluginManager)
      .getGroupedClientRoutes()
      .forEach(plugin => {
        plugin.routes.map(route => {
          pluginComponents.push({
            name: route.path.charAt(1).toUpperCase() + route.path.slice(2),
            component: route.component,
          })
        })
      })

  const componentMapping = {
    spell: Composer,
    module: Composer,
    Events,
    Requests,
    Settings,
    Documents,
    Agents,
    ...pluginComponents.reduce((acc, obj) => {
      acc[obj.name] = obj.component
      return acc
    }, {}),
  }


  const Workspace = componentMapping[tab.type];
  const props = {
    pubSub,
    tab
  };

  if (!Workspace) {
    return null;
  }

  const isActive = tab.id === activeTabId

  return (
    <div
      key={tab.name}
      style={{
        visibility: !isActive ? 'hidden' : undefined,
        height: !isActive ? 0 : undefined,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }}
    >
      <WorkspaceProvider {...props}>
        <Workspace {...props} />;
      </WorkspaceProvider>
    </div>
  )
}

// We want to render all workspaces and components together so we can hold them in memory
// and not have to re-render them when switching between tabs.
const Workspaces = ({ tabs, pubSub, activeTabId }) => {
  return (
    <>
      {tabs.map((tab) => {
        // render the component if it is a component type
        return <WorkspaceComponent key={tab.id} tab={tab} pubSub={pubSub} activeTabId={activeTabId} />;
      })}
    </>
  );
};

export default Workspaces;
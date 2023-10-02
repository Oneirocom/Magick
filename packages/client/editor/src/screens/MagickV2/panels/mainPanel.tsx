import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewHeaderActionsProps,
  IDockviewPanelProps,
} from 'dockview'
import { useTabLayout } from '@magickml/providers';
import Events from '../../EventWindow'
import Requests from '../../RequestWindow'
import Settings from '../../settings/SettingsWindow'
import Documents from '../../DocumentWindow'
import Agents from '../../agents/AgentManagerWindow'
import { ClientPluginManager, pluginManager } from 'shared/core'
import Composer from '../workspaces/composer'
import NewMenuBar from '../../../components/MenuBar/newMenuBar';

import './tab-layout.scss'

// we will move this out into the layouts package
function loadDefaultLayout(api: DockviewApi) {
  api.addPanel({
    id: 'panel_1',
    component: 'default',
    params: {
      spellId: 'root',
      spellName: 'root',
      type: 'spell',
    },
  })

  api.addPanel({
    id: 'panel_2',
    component: 'default',
  })

  api.addPanel({
    id: 'panel_3',
    component: 'default',
  })
}

import { IDockviewPanelHeaderProps, DockviewDefaultTab } from 'dockview';

const TabHeader = (props: IDockviewPanelHeaderProps) => {
  const onContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    alert('context menu');
  };
  // @ts-ignore
  return <DockviewDefaultTab onContextMenu={onContextMenu} {...props} />;
};

const tabComponents = {
  tabHeader: TabHeader,
};

const getComponents = () => {
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

  return {
    Events,
    Requests,
    Settings,
    Documents,
    Agents,
    ...pluginComponents.reduce((acc, obj) => {
      acc[obj.name] = obj.component
      return acc
    }, {}),
    spell: Composer,
    default: (props: IDockviewPanelProps<{ title: string }>) => {
      return (
        <div
          style={{
            height: '100%',
            padding: '20px',
            background: 'var(--dv-group-view-background-color)',
          }}
        >
          {JSON.stringify(props.params)}
        </div>
      )
    },
  }
}

const PreControls = (props: IDockviewHeaderActionsProps) => {
  return (
    <div
      className="group-control"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0px",
        height: "100%",
        color: "var(--dv-activegroup-visiblepanel-tab-color)"
      }}
    >
      <NewMenuBar />
    </div>
  );
};

const MainPanel = () => {
  const { theme, setApi, getLayout } = useTabLayout()

  const onReady = (event: DockviewReadyEvent) => {
    const layout = getLayout()

    let success = false

    if (layout) {
      event.api.fromJSON(layout)
      success = true
    }

    if (!success) {
      loadDefaultLayout(event.api)
    }

    setApi(event.api)
  }

  return (
    <DockviewReact
      onReady={onReady}
      preHeaderActionsComponent={PreControls}
      tabComponents={tabComponents}
      className={`tab-layout ${theme}`}
      components={getComponents()}
    />
  )
}

export default MainPanel

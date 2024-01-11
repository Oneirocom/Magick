import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewHeaderActionsProps,
  IDockviewPanelProps,
  IDockviewPanelHeaderProps,
  DockviewDefaultTab
} from 'dockview'
import { useHotkeys } from 'react-hotkeys-hook';
import { useTabLayout } from '@magickml/providers';
import Events from '../screens/EventWindow'
import Requests from '../screens/RequestWindow'
import Settings from '../screens/settings/SettingsWindow'
import Config from '../screens/ConfigWindow'
import Documents from '../screens/DocumentWindow'
import Agents from '../screens/agents/AgentManagerWindow'
import Secrets from '../screens/SecretsWindow'
import { ClientPluginManager, pluginManager } from 'shared/core'
import Composer from '../components/workspaces/composer'
import ComposerV2 from '../components/workspaces/composerv2'
import NewMenuBar from '../components/MenuBar/newMenuBar';

import './tab-layout.scss'
import WelcomeScreen from '../components/Watermark/watermark';


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
    Config,
    ...pluginComponents.reduce((acc, obj) => {
      acc[obj.name] = obj.component
      return acc
    }, {}),
    Secrets,
    spell: Composer,
    behave: ComposerV2,
    default: (props: IDockviewPanelProps<{ title: string }>) => {
      return (
        <div
          style={{
            height: '100%',
            padding: '20px',
            background: 'var(--background-color)',
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
  const { theme, setApi, getLayout, api } = useTabLayout()

  useHotkeys('ctrl+alt+right', () => {
    if (!api) return
    api.moveToNext({ includePanel: true });
  })

  useHotkeys('ctrl+alt+left', () => {
    if (!api) return
    api.moveToPrevious({ includePanel: true });
  })

  const onReady = (event: DockviewReadyEvent) => {
    const layout = getLayout()

    if (layout) {
      event.api.fromJSON(layout)
    }

    setApi(event.api)
  }

  return (
    <DockviewReact
      onReady={onReady}
      watermarkComponent={WelcomeScreen}
      prefixHeaderActionsComponent={PreControls}
      tabComponents={tabComponents}
      className={`tab-layout ${theme}`}
      components={getComponents()}
    />
  )
}

export default MainPanel

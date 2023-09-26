import { createContext, useContext, useEffect, useState } from "react"
import {
  DockviewApi,
  DockviewReact, DockviewReadyEvent, IDockviewPanelProps, SerializedDockview,
} from 'dockview';
import { usePubSub } from "@magickml/client-core";
import Composer from "../screens/Composer";
import Events from '../screens/EventWindow'
import Requests from '../screens/RequestWindow'
import Settings from '../screens/settings/SettingsWindow'
import Documents from '../screens/DocumentWindow'
import Agents from '../screens/agents/AgentManagerWindow';
import { getWorkspaceLayout } from "@magickml/layouts";
import NewMenuBar from "../components/MenuBar/newMenuBar";
import { ClientPluginManager, pluginManager } from "@magickml/core";


// we will move this out into the layouts package
function loadDefaultLayout(api: DockviewApi) {
  api.addPanel({
    id: 'panel_1',
    component: 'default',
    params: {
      spellId: 'root',
      spellName: 'root',
      type: 'spell',
    }
  });

  api.addPanel({
    id: 'panel_2',
    component: 'default',
  });

  api.addPanel({
    id: 'panel_3',
    component: 'default',
  });
}

const getComponents = () => {
  const pluginComponents = [];

  (pluginManager as ClientPluginManager)
    .getGroupedClientRoutes()
    .forEach(plugin => {
      plugin.routes.map(route => {
        pluginComponents.push({
          name: route.path.charAt(1).toUpperCase() + route.path.slice(2),
          component: route.component,
        })
      })
    })

  console.log('pluginComponents', pluginComponents)
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
      );
    },
  }
}

type DockviewTheme = 'dockview-theme-abyss'

export type Tab = {
  id: string
  name: string
  spellName?: string
  type: string
  workspace?: string
  switchActive?: boolean
}

type DocviewContext = {
  theme: DockviewTheme,
  setTheme: (theme: DockviewTheme) => void,
  api: DockviewApi,
  setApi: (api: DockviewApi) => void,
  getLayout: () => SerializedDockview | null,
  setLayout: (layout: SerializedDockview) => void

  // IMPLEMENT THESE
  openTab: (tab: Tab) => void
  closeTab?: (tab: any) => void
  switchTab?: (tab: any) => void
}

const TAB_LAYOUT_KEY = 'tab-layout'


// Creating the context
const Context = createContext<DocviewContext>(undefined!)

// Helper hook to use Layout context
export const useTabLayout = () => useContext(Context)

export const TabProvider = ({ children }) => {
  const [theme, setTheme] = useState<DockviewTheme>('dockview-theme-abyss')
  const [api, setApi] = useState<DockviewApi>();
  const pubSub = usePubSub()

  const getLayout = () => {
    const layout = localStorage.getItem(TAB_LAYOUT_KEY)

    if (!layout) {
      return null
    }
    return JSON.parse(localStorage.getItem(TAB_LAYOUT_KEY)) as SerializedDockview
  }

  const setLayout = (layout: SerializedDockview) => {
    localStorage.setItem(TAB_LAYOUT_KEY, JSON.stringify(layout))
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    // set up API event handlers
    api.onDidLayoutChange(() => {
      const layout = api.toJSON();

      setLayout(layout)
    });

  }, [api]);

  const openTab = (_tab: Tab) => {
    const tab = {
      ..._tab,
      layoutJson: getWorkspaceLayout(_tab?.workspace),
    }
    api.addPanel({
      id: tab.name,
      component: tab.type,
      params: {
        tab
      }
    });
  }

  const publicInterface = {
    theme,
    setTheme,
    api,
    setApi,
    getLayout,
    setLayout,
    openTab
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export const TabLayout = ({ children }) => {
  const { theme, setTheme, setApi, api, setLayout, getLayout } = useTabLayout()

  const onReady = (event: DockviewReadyEvent) => {

    const layout = getLayout()

    let success = false;

    if (layout) {
      event.api.fromJSON(layout);
      success = true;
    }

    if (!success) {
      loadDefaultLayout(event.api);
    }

    setApi(event.api)
  };

  return (

    <DockviewReact
      onReady={onReady}
      className={`tab-layout ${theme}`}
      components={getComponents()}
    />
  )
}
import { createContext, useContext, useEffect, useState } from "react"
import {
  DockviewApi,
  DockviewReact, DockviewReadyEvent, IDockviewPanelProps, SerializedDockview,
} from 'dockview';

function loadDefaultLayout(api: DockviewApi) {
  api.addPanel({
    id: 'panel_1',
    component: 'default',
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

type DockviewTheme = 'dockview-theme-abyss'

type DocviewContext = {
  theme: DockviewTheme,
  setTheme: (theme: DockviewTheme) => void,
  api: DockviewApi,
  setApi: (api: DockviewApi) => void,
  getLayout: () => SerializedDockview | null,
  setLayout: (layout: SerializedDockview) => void

}

const TAB_LAYOUT_KEY = 'tab-layout'

// Creating the context
const Context = createContext<DocviewContext>(undefined!)

// Helper hook to use Layout context
export const useLayout = () => useContext(Context)

export const TabProvider = ({ children }) => {
  const [theme, setTheme] = useState<DockviewTheme>('dockview-theme-abyss')
  const [api, setApi] = useState<DockviewApi>();

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

  const publicInterface = {
    theme,
    setTheme,
    api,
    setApi,
    getLayout,
    setLayout
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export const TabLayout = ({ children }) => {
  const { theme, setTheme, setApi, api, setLayout, getLayout } = useLayout()

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

  return (<DockviewReact
    onReady={onReady}
    className={theme}
    components={components}
  />)
}

const components = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          height: '100%',
          padding: '20px',
          background: 'var(--dv-group-view-background-color)',
        }}
      >
        {props.params.title}
      </div>
    );
  }
}
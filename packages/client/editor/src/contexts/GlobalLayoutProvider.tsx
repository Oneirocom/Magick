import { createContext, useContext, useEffect, useState } from 'react'
import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
  SerializedDockview,
} from 'dockview'

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

const getComponents = () => {
  return {
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

type DockviewTheme = 'dockview-theme-abyss'

type DocviewContext = {
  theme: DockviewTheme
  setTheme: (theme: DockviewTheme) => void
  api: DockviewApi
  setApi: (api: DockviewApi) => void
  getLayout: () => SerializedDockview | null
  setLayout: (layout: SerializedDockview) => void
}

const LAYOUT_KEY = 'global-layout'

// Creating the context
const Context = createContext<DocviewContext>(undefined!)

// Helper hook to use Layout context
export const useGlobalLayout = () => useContext(Context)

export const GlobalLayoutProvider = ({ children }) => {
  const [theme, setTheme] = useState<DockviewTheme>('dockview-theme-abyss')
  const [api, setApi] = useState<DockviewApi>()

  const getLayout = () => {
    const layout = localStorage.getItem(LAYOUT_KEY)

    if (!layout) {
      return null
    }
    return JSON.parse(localStorage.getItem(LAYOUT_KEY)) as SerializedDockview
  }

  const setLayout = (layout: SerializedDockview) => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout))
  }

  useEffect(() => {
    if (!api) {
      return
    }

    // set up API event handlers
    api.onDidLayoutChange(() => {
      const layout = api.toJSON()

      setLayout(layout)
    })
  }, [api])

  const publicInterface = {
    theme,
    setTheme,
    api,
    setApi,
    getLayout,
    setLayout,
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

import { createContext, useContext, useEffect, useState } from 'react'
import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
  SerializedDockview,
} from 'dockview'
import { usePubSub } from '@magickml/providers'
import { getWorkspaceLayout } from 'client/layouts'

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
  theme: DockviewTheme
  setTheme: (theme: DockviewTheme) => void
  api: DockviewApi
  setApi: (api: DockviewApi) => void
  getLayout: () => SerializedDockview | null
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
  const [api, setApi] = useState<DockviewApi>()
  const pubSub = usePubSub()

  const getLayout = () => {
    const layout = localStorage.getItem(TAB_LAYOUT_KEY)

    if (!layout) {
      return null
    }
    return JSON.parse(
      localStorage.getItem(TAB_LAYOUT_KEY)
    ) as SerializedDockview
  }

  const setLayout = (layout: SerializedDockview) => {
    localStorage.setItem(TAB_LAYOUT_KEY, JSON.stringify(layout))
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

  const openTab = (_tab: Tab) => {
    const tab = {
      ..._tab,
      layoutJson: getWorkspaceLayout(_tab?.workspace),
    }
    api.addPanel({
      id: tab.name,
      component: tab.type,
      params: {
        tab,
        theme,
      },
    })
  }

  const publicInterface = {
    theme,
    setTheme,
    api,
    setApi,
    getLayout,
    setLayout,
    openTab,
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

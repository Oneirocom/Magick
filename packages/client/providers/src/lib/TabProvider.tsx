import { createContext, useContext, useEffect, useState } from 'react'
import {
  DockviewApi,
  SerializedDockview,
} from 'dockview'
import { usePubSub } from '@magickml/providers'
import { getWorkspaceLayout } from 'client/layouts'
import { setCurrentTab, useDockviewTheme } from 'client/state'
import { useDispatch } from 'react-redux'

export type Tab = {
  id: string
  name: string
  spellName?: string
  type: string
  workspace?: string
  switchActive?: boolean
}

type DocviewContext = {
  theme: string
  setTheme: (theme: string) => void
  api: DockviewApi | undefined
  setApi: (api: DockviewApi) => void
  getLayout: () => SerializedDockview | null
  setLayout: (layout: SerializedDockview) => void

  // IMPLEMENT THESE
  openTab: (tab: Tab) => void
  closeTab?: (tab: any) => void
  switchTab?: (tab: any) => void

  isTabOpen: (id: string) => boolean
}

const TAB_LAYOUT_KEY = 'tab-layout'

// Creating the context
const Context = createContext<DocviewContext>(undefined!)

// Helper hook to use Layout context
export const useTabLayout = () => useContext(Context)

export const TabProvider = ({ children }) => {
  const { theme, setTheme } = useDockviewTheme()
  const [api, setApi] = useState<DockviewApi | undefined>()
  const dispatch = useDispatch()
  const pubSub = usePubSub()

  const getLayout = () => {
    const layout = localStorage.getItem(TAB_LAYOUT_KEY)

    if (!layout) {
      return null
    }
    return JSON.parse(
      layout
    ) as SerializedDockview
  }

  const setLayout = (layout: SerializedDockview) => {
    localStorage.setItem(TAB_LAYOUT_KEY, JSON.stringify(layout))
  }

  useEffect(() => {
    if (!api) {
      return
    }

    api.onDidActivePanelChange((panel) => {
      if (!panel) return

      console.log("PANEL CHANGED", panel)
      dispatch(setCurrentTab({
        id: panel.id,
        title: panel.title,
      }))
    })

    // set up API event handlers
    api.onDidLayoutChange(() => {
      const layout = api.toJSON()

      setLayout(layout)
    })
  }, [api])

  const isTabOpen = (id: string) => {
    if (!api) return false

    const panel = api.getPanel(id)

    return !!panel
  }

  const setActiveTab = (id: string) => {
    if (!api) return

    const panel = api.getPanel(id)

    if (!panel) return

    panel.api.setActive()
  }

  const openTab = (_tab: Tab) => {
    if (!api) return

    const tab = {
      ..._tab,
      layoutJson: getWorkspaceLayout(_tab?.workspace),
    }

    if (isTabOpen(tab.name)) {
      setActiveTab(tab.name)
      return
    }

    api.addPanel({
      id: tab.name,
      component: tab.type,
      tabComponent: 'tabHeader',
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
    isTabOpen
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

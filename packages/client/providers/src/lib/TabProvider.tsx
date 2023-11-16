import { createContext, useContext, useEffect, useState } from 'react'
import {
  DockviewApi,
  SerializedDockview,
} from 'dockview'
import { useConfig, usePubSub } from '@magickml/providers'
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
  params?: Record<string, unknown>
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

  renameTab: (id: string, newName: string) => void
  isTabOpen: (id: string) => boolean
}

// Creating the context
const Context = createContext<DocviewContext>(undefined!)

// Helper hook to use Layout context
export const useTabLayout = () => useContext(Context)

export const TabProvider = ({ children }) => {
  const { theme, setTheme } = useDockviewTheme()
  const { subscribe, events } = usePubSub()
  const config = useConfig()
  const [api, setApi] = useState<DockviewApi | undefined>()
  const dispatch = useDispatch()

  const TAB_LAYOUT_KEY = `${config.projectId}/tab-layout`

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

      dispatch(setCurrentTab({
        id: panel.id,
        title: panel.title,
        params: panel.params,
      }))
    })

    // set up API event handlers
    api.onDidLayoutChange(() => {
      const layout = api.toJSON()

      setLayout(layout)
    })

    const unsubscribeOpenTab = subscribe(events.OPEN_TAB, (event, data) => {
      if (!data) return
      openTab({
        id: data.name,
        name: data.name,
        spellName: data.name,
        type: 'spell',
        params: {
          spellId: data.spellId,
        }
      })
    })

    return () => {
      unsubscribeOpenTab()
    }

  }, [api])


  const isTabOpen = (id: string) => {
    if (!api) return false

    const panel = api.getPanel(id)

    return !!panel
  }

  const renameTab = (id: string, newName: string) => {
    if (!api) return

    const panel = api.getPanel(id)

    if (!panel) return

    panel.api.setTitle(newName)
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

    console.log('OPENING TAB', tab)

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
        ...tab.params
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
    isTabOpen,
    renameTab
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

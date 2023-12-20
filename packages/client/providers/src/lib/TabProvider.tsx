import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  DockviewApi,
  SerializedDockview,
} from 'dockview'
import { useConfig, usePubSub } from '@magickml/providers'
import { getWorkspaceLayout } from 'client/layouts'
import { RootState, setCurrentTab, useDockviewTheme } from 'client/state'
import { useDispatch, useSelector } from 'react-redux'

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

const generateTabLayoutKey = (projectId: string, agentId?: string) => {
  return `${projectId}/tab-layout/${agentId || 'draft-agent'}`
}

export const TabProvider = ({ children }) => {
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId: _currentAgentId } = globalConfig
  const currentAgentRef = useRef(_currentAgentId)

  const { theme, setTheme } = useDockviewTheme()
  const { subscribe, events } = usePubSub()
  const config = useConfig()
  const [api, setApi] = useState<DockviewApi | undefined>()
  const dispatch = useDispatch()

  useEffect(() => {
    currentAgentRef.current = _currentAgentId
  }, [_currentAgentId])

  const getLayout = () => {
    const currentAgentId = currentAgentRef.current
    const TAB_LAYOUT_KEY = generateTabLayoutKey(config.projectId, currentAgentId)
    const layout = localStorage.getItem(TAB_LAYOUT_KEY)

    if (!layout) {
      return null
    }
    return JSON.parse(
      layout
    ) as SerializedDockview
  }

  const setLayout = (layout: SerializedDockview) => {
    const currentAgentId = currentAgentRef.current
    const TAB_LAYOUT_KEY = generateTabLayoutKey(config.projectId, currentAgentId)
    localStorage.setItem(TAB_LAYOUT_KEY, JSON.stringify(layout))
  }

  useEffect(() => {
    if (!api) {
      return
    }

    const layout = getLayout()

    if (layout) {
      api.fromJSON(layout)
    } else {
      api.clear()
    }
  }, [_currentAgentId])

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

  const closeTab = (tabId: string) => {
    if (!api) return

    const panel = api.getPanel(tabId)

    if (!panel) return

    panel.api.close()
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
    renameTab,
    closeTab
  }
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

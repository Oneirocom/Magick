import { useContext, createContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

import LoadingScreen from '../components/LoadingScreen/LoadingScreen'
import { useDB } from './DatabaseProvider'
import defaultJson from '../data/layouts/defaultLayout.json'
import { usePubSub } from './PubSubProvider'

const Context = createContext({
  tabs: [],
  activeTab: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openTab: async options => { },
  switchTab: x => { },
  closeTab: x => { },
  saveTabLayout: () => { },
  clearTabs: () => { },
  closeTabBySpellId: spellId => { },
  updateTab: (tabId, update) => Promise.resolve(),
})

// Map of workspaces
const workspaceMap = {
  default: defaultJson,
}

export const useTabManager = () => useContext(Context)

const TabManager = ({ children }) => {
  const { db } = useDB()

  // eslint-disable-next-line no-unused-vars
  const { events, publish } = usePubSub()
  const navigate = useNavigate()
  const [tabs, setTabs] = useState(null)
  const [activeTab, setActiveTab] = useState(null)

  // Suscribe to changes in the database for active tab, and all tabs
  useEffect(() => {
    if (!db) return
      ; (async () => {
        refreshTabs()
      })()
  }, [db])

  const filterTabs = tabDocs => {
    return tabDocs
      .map(tab => tab.toJSON())
      .map(({ active, ...rest }) => ({ ...rest }))
  }

  const refreshTabs = async () => {
    const activeTab = await db.tabs
      .findOne({ selector: { active: true } })
      .exec()
    if (activeTab) setActiveTab(activeTab.toJSON())

    // We want to exclude the 'active' field soince this changes,which causes rerenders we dont want.
    const tabDocs = await db.tabs.find().exec()
    const tabs = filterTabs(tabDocs)
    if (tabs && tabs.length > 0) setTabs(tabs)
    if (!tabs || tabs.length === 0) setTabs([])
  }

  const updateTab = async (tabId, update) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec()
    if (!tab) return

    await tab.atomicPatch(update)
    await refreshTabs()
  }

  const openTab = async ({
    workspace = 'default',
    name = 'Untitled',
    type = 'module',
    moduleName = '',
    spellId = null,
    openNew = true,
  }) => {
    // don't open a new tab if one is already open
    if (!openNew && type === 'module') {
      const tabOpened = await switchTab(null, { module: { $eq: moduleName } })
      if (tabOpened) return
    }

    if (!openNew && type === 'spell') {
      const tabOpened = await switchTab(null, { spell: { $eq: spellId } })
      if (tabOpened) return
    }

    const newTab = {
      layoutJson: workspaceMap[workspace],
      name,
      id: uuidv4(),
      spell: spellId,
      module: moduleName,
      type: type,
      active: true,
    }

    const newTabDoc = await db.tabs.insert(newTab)
    refreshTabs()
  }

  const closeTab = async tabId => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec()
    if (!tab) return
    publish(events.$CLOSE_EDITOR(tabId))
    await tab.remove()
    const tabs = await db.tabs.find().exec()
    await refreshTabs()

    // Switch to the last tab down.
    if (tabs.length === 0) {
      navigate('/home')
      return
    }
    switchTab(tabs[0].id)
  }

  const switchTab = async (tabId, query) => {
    const selector = query ? query : { id: tabId }
    const tab = await db.tabs.findOne({ selector }).exec()
    if (!tab) return false
    await tab.atomicPatch({ active: true })

    await refreshTabs()
    return true
  }

  const clearTabs = async () => {
    await db.tabs.find().remove()
  }

  const closeTabBySpellId = async spellId => {
    const tab = await db.tabs.findOne({ selector: { spell: spellId } }).exec()
    if (!tab) return false

    await closeTab(tab.id)
    return true
  }

  const saveTabLayout = async (tabId, json) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec()
    await tab.atomicPatch({ layoutJson: json })
  }

  const publicInterface = {
    tabs,
    activeTab,
    openTab,
    switchTab,
    closeTab,
    saveTabLayout,
    clearTabs,
    updateTab,
    closeTabBySpellId,
  }

  if (!tabs) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default TabManager

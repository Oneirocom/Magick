// DOCUMENTED
import {
  createDraftSafeSelector,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'

import defaultJson from '../data/layouts/defaultLayout.json'
import fullScreen from '../data/layouts/fullScreenLayout.json'
import promptEngineering from '../data/layouts/promptEngineeringLayout.json'
import troubleShooting from '../data/layouts/troubleshootingLayout.json'
import { RootState } from './store'

// Workspace map for initializing tabs with layout data
export const workspaceMap = {
  default: defaultJson,
  fullScreen,
  promptEngineering,
  troubleShooting,
}

/**
 * Tab interface representing a tab object
 */
export interface Tab {
  id: string
  name: string
  URI: string
  active: boolean
  layoutJson: Record<string, unknown>
  type?: 'spell'
  spell?: string
  spellName: string
  module: string
  componentType?: string
}

// Entity adapter for tabs
const tabAdapater = createEntityAdapter<Tab>()
const tabSelectors = tabAdapater.getSelectors()

// Initial State for tabs
const initialState = tabAdapater.getInitialState()

/**
 * Selects the active tab from the given tabs array.
 */
const _activeTabSelector = createDraftSafeSelector(
  tabSelectors.selectAll,
  tabs => {
    return Object.values(tabs).find(tab => tab?.active)
  }
)

/**
 * Selects the tab with the specified UUID from the given tabs array.
 */
const selectTabBySpellUUID = createDraftSafeSelector(
  [state => tabSelectors.selectAll(state), (_, id) => id],
  (tabs, id) => Object.values(tabs).find(tab => tab.id === id)
)

/**
 * Decodes a URI-encoded string and returns the decoded name portion.
 */
const encodedToName = (uri: string) => {
  uri = decodeURIComponent(uri)
  return atob(uri.slice(37))
}

/**
 * Decodes a URI-encoded string and returns the decoded ID portion.
 */
const encodedToId = (uri: string) => {
  uri = decodeURIComponent(uri)
  return uri.slice(0, 36)
}

/**
 * Constructs a new tab object with the specified properties and defaults.
 */
const buildTab = (tab, properties = {}) => ({
  ...tab,
  id: encodedToId(tab.name) || tab.name,
  URI: encodeURIComponent(tab.name) || tab.name,
  name: encodedToName(tab.name) || tab.name,
  layoutJson: workspaceMap[tab.workspace || 'default'],
  spell: tab?.spell || null,
  type: tab?.type,
  module: tab?.moduleName || null,
  ...properties,
})

/**
 * Tab slice containing reducer and actions for managing tabs.
 */
export const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    // Opens a tab, either creating a new one or switching to the existing tab
    openTab: (state, action) => {
      const switchActive =
        'switchActive' in action.payload ? action.payload.switchActive : true
      const activeTab = _activeTabSelector(state) as Tab
      if (activeTab && switchActive)
        tabAdapater.updateOne(state, {
          id: activeTab.id,
          changes: { active: false },
        })

      const existingTab = selectTabBySpellUUID(
        state,
        encodedToId(action.payload.name)
      )

      if (existingTab && !switchActive) return

      if (existingTab && !action.payload.openNew) {
        tabAdapater.updateOne(state, {
          id: existingTab.id,
          changes: {
            active: switchActive,
          },
        })
        return
      }

      const tab = buildTab(action.payload, {
        active: true,
        componentType: action.payload.componentType || 'DefaultComponent',
      })
      tabAdapater.addOne(state, tab)
    },
    closeTab: tabAdapater.removeOne,
    switchTab: tabAdapater.updateOne,
    clearTabs: tabAdapater.removeAll,
    changeActive: tabAdapater.updateMany,
    saveTabLayout: (state, action) => {
      tabAdapater.updateOne(state, {
        id: action.payload.tabId,
        changes: { layoutJson: action.payload.layoutJson },
      })
    },
    changeEditorLayout: (state, action) => {
      tabAdapater.updateOne(state, {
        id: action.payload.tabId,
        changes: { layoutJson: workspaceMap[action.payload.layout] },
      })
    },
  },
})

// Export actions
export const {
  openTab,
  closeTab,
  switchTab,
  clearTabs,
  saveTabLayout,
  changeActive,
  changeEditorLayout,
} = tabSlice.actions

// Export selectors
export const activeTabSelector = (state: RootState) =>
  _activeTabSelector(state.tabs)

export const { selectAll: selectAllTabs } = tabSelectors

export default tabSlice.reducer

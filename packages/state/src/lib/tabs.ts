// DOCUMENTED
import { getWorkspaceLayout } from '@magickml/layouts'
import {
  createDraftSafeSelector,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import { RootState } from './store'

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
  layoutJson: getWorkspaceLayout(tab.workspace),
  spell: tab?.spell || null,
  type: tab?.type,
  module: tab?.moduleName || null,
  ...properties,
})

export type AdditionalState = {
  activeTabId: string | null
}

/**
 * Tab slice containing reducer and actions for managing tabs.
 */
export const tabSlice = createSlice({
  name: 'tabs',
  initialState: tabAdapater.getInitialState<AdditionalState>({
    activeTabId: null,
  }),
  reducers: {
    //   Opens a tab, either creating a new one or switching to the existing tab
    openTab: (state, action) => {
      const switchActive =
        'switchActive' in action.payload ? action.payload.switchActive : true

      const newTab = buildTab(action.payload, {
        componentType: action.payload.componentType || 'DefaultComponent',
      })

      tabAdapater.addOne(state, newTab)

      if (switchActive) {
        state.activeTabId = newTab.id
      }
    },
    closeTab: (state, action) => {
      // if there are other tabs, grab the next one to be active
      if (state.ids.length > 1) {
        const nextTab = state.ids.find(id => id !== action.payload)
        const tab = nextTab ? state.entities[nextTab] : null

        state.activeTabId = tab ? tab.id : null
      } else {
        state.activeTabId = null
      }
      tabAdapater.removeOne(state, action.payload)
    },
    switchTab: tabAdapater.updateOne,
    clearTabs: tabAdapater.removeAll,
    changeActive: (state, action) => {
      state.activeTabId = action.payload
    },
    saveTabLayout: (state, action) => {
      tabAdapater.updateOne(state, {
        id: action.payload.tabId,
        changes: { layoutJson: action.payload.layoutJson },
      })
    },
    changeEditorLayout: (state, action) => {
      tabAdapater.updateOne(state, {
        id: action.payload.tabId,
        changes: { layoutJson: getWorkspaceLayout(action.payload.layout) },
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

/**
 * Selects the active tab from the given tabs array.
 */
const _activeTabSelector = createDraftSafeSelector(
  [state => tabSelectors.selectAll(state), state => state.activeTabId],
  (tabs, activeTabId) => {
    const activeTab = tabs.find(tab => tab.id === activeTabId)
    return activeTab
  }
)

export const activeTabIdSelector = (state: RootState) => state.tabs.activeTabId

// Export selectors
export const activeTabSelector = (state: RootState) =>
  _activeTabSelector(state.tabs)

export const { selectAll: selectAllTabs } = tabSelectors

export default tabSlice.reducer

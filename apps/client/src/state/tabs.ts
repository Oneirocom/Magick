import { v4 as uuidv4 } from 'uuid'
import {
  createSlice,
  // PayloadAction,
  createDraftSafeSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { RootState } from './store'
import defaultJson from '../data/layouts/defaultLayout.json'

// Used to set workspaces to tabs
const workspaceMap = {
  default: defaultJson,
}
export interface Tab {
  id: string
  name: string
  active: boolean
  layoutJson: Record<string, unknown>
  type?: 'spell' | 'module'
  // probably going to need to insert a proper spell type in here
  spell?: string
  spellId: string
  // this will also be a ref to a property somewhere else
  module: string
}

// Entity adapter
const tabAdapater = createEntityAdapter<Tab>()
const tabSelectors = tabAdapater.getSelectors()

// Initial State
const initialState = tabAdapater.getInitialState()

// Selectors
const _activeTabSelector = createDraftSafeSelector(
  tabSelectors.selectAll,
  tabs => {
    return Object.values(tabs).find(tab => tab?.active)
  }
)

const selectTabBySpellId = createDraftSafeSelector(
  [state => tabSelectors.selectAll(state), (_, spellId) => spellId],
  (tabs, spellId) => Object.values(tabs).find(tab => tab.spellId === spellId)
)

// Used to build a tab with various defaults set, as well as workspace json and UUID
const buildTab = (tab, properties = {}) => ({
  ...tab,
  name: tab.name || 'Untitled',
  id: uuidv4(),
  layoutJson: workspaceMap[tab.workspace || 'default'],
  spell: tab?.spell || null,
  type: tab?.type || 'module',
  module: tab?.moduleName || null,
  ...properties,
})

// This is the primary composed of our "duck", and returns a number of helper functions and properties.
export const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    openTab: (state, action) => {
      const switchActive =
        'switchActive' in action.payload ? action.payload.switchActive : true

      const activeTab = _activeTabSelector(state) as Tab
      if (activeTab && switchActive)
        tabAdapater.updateOne(state, {
          id: activeTab.id,
          changes: { active: false },
        })

      // Check if the tab is already open.
      const existingTab = selectTabBySpellId(state, action.payload.spellId)

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
      //

      const tab = buildTab(action.payload, { active: true })
      tabAdapater.addOne(state, tab)
    },
    closeTab: tabAdapater.removeOne,
    switchTab: tabAdapater.updateOne,
    clearTabs: tabAdapater.removeAll,
    changeActive: tabAdapater.updateMany,
    saveTabLayout: (state, action) => {},
  },
})

// actions
export const { openTab, closeTab, switchTab, clearTabs, saveTabLayout, changeActive } =
  tabSlice.actions

// selectors
export const activeTabSelector = (state: RootState) =>
  _activeTabSelector(state.tabs)

export const { selectAll: selectAllTabs } = tabSelectors

export default tabSlice.reducer

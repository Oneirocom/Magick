/**
 * Module that exports a Redux slice for the global config that carries the authentication, project id and API url information.
 * @module globalConfigSlice
 */

import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'
import { SaveDiffData } from 'packages/client/feathers-client/src/lib/FeathersClient'

type ActiveInputType = {
  name: string
  inputType: string
  value: string
}

/**
 * Interface that defines the Global Config type.
 */
export interface GlobalConfig {
  apiUrl: string
  token: string
  projectId: string
  currentAgentId: string
  currentSpellReleaseId: string
  theme: string
  dockviewTheme: string
  textEditorState: string
  activeInput: ActiveInputType
  pastState: SaveDiffData[]
  futureState: SaveDiffData[]
}

/**
 * Slice of the GlobalConfig to be used in Redux store.
 * @type {Slice<GlobalConfig>}
 */
export const globalConfigSlice: Slice<GlobalConfig> = createSlice({
  name: 'globalConfig',
  initialState: {
    apiUrl: '',
    token: '',
    projectId: '',
    currentAgentId: '',
    currentSpellReleaseId: '',
    textEditorState: '',
    pastState: [] as SaveDiffData[],
    futureState: [] as SaveDiffData[],
    activeInput: {
      name: '',
      inputType: '',
      value: '',
    },
    dockviewTheme: 'dockview-theme-night',
    theme: 'abyss',
  },
  reducers: {
    /**
     * Reducer method for setting the global config.
     * @param {GlobalConfig} state - The current global config state.
     * @param {PayloadAction<GlobalConfig>} action - Config to set on the global state.
     * @return {void}
     */
    setConfig: (
      state: GlobalConfig,
      action: PayloadAction<GlobalConfig>
    ): void => {
      const { apiUrl, token, projectId } = action.payload
      state.apiUrl = apiUrl
      state.token = token
      state.projectId = projectId
    },
    applyState: (
      state: GlobalConfig,
      action: PayloadAction<{ value: SaveDiffData }>
    ) => {
      if (!action.payload.value) return
      const MAX_HISTORY = 30
      if (state.pastState?.length >= MAX_HISTORY) {
        const update = [...state.pastState.slice(1)]
        state.pastState = update
      }
      const update = [...(state.pastState || []), action.payload.value]
      state.pastState = update
      state.futureState = [] // Clear redo stack
      console.log('applyState', {
        pastState: state.pastState,
        futureState: state.futureState,
      })
    },
    undoState: (state: GlobalConfig) => {
      // Separate modification from assignment
      if (state.pastState.length > 0) {
        const lastState = state.pastState.slice(-1)[0] // Get last item without modifying
        state.pastState = state.pastState.slice(0, -1) // Remove the last item by re-assigning
        const update = [lastState, ...state.futureState]
        state.futureState = update
      }

      console.log('STATE_TWO', {
        past: state.pastState,
        future: state.futureState,
      })
    },
    redoState: (state: GlobalConfig) => {
      if (state.futureState.length > 0) {
        const nextState = state.futureState[0] // Get first item without modifying
        state.futureState = state.futureState.slice(1) // Remove the first item by re-assigning
        const update = [nextState, ...state.pastState]
        state.pastState = update // Append nextState to pastState
        console.log('STATE_THREE', {
          past: state.pastState,
          future: state.futureState,
        })
      }
    },
    setCurrentAgentId: (
      state: GlobalConfig,
      action: PayloadAction<string>
    ): void => {
      state.currentAgentId = action.payload
    },
    setCurrentSpellReleaseId: (
      state: GlobalConfig,
      action: PayloadAction<string>
    ): void => {
      state.currentSpellReleaseId = action.payload
    },
    setTheme: (state: GlobalConfig, action: PayloadAction<string>): void => {
      state.theme = action.payload
    },
    setDockviewTheme: (
      state: GlobalConfig,
      action: PayloadAction<string>
    ): void => {
      state.dockviewTheme = action.payload
    },
    setActiveInput: (
      state: GlobalConfig,
      action: PayloadAction<ActiveInputType>
    ): void => {
      state.activeInput = action.payload
    },
  },
})

// Actions
/**
 * Action to set the global configuration.
 */
export const {
  setConfig,
  setCurrentAgentId,
  setDockviewTheme,
  setCurrentSpellReleaseId,
  setTextEditorState,
  setActiveInput,
  applyState,
  undoState,
  redoState,
} = globalConfigSlice.actions

/**
 * Export GlobalConfigSlice reducer.
 */
export default globalConfigSlice.reducer

export const selectActiveInput = state =>
  state.globalConfig.activeInput as {
    name: string
    inputType: string
    value: string
  }

export const selectPastState = state => state.globalConfig.pastState
export const selectFutureState = state => state.globalConfig.futureState

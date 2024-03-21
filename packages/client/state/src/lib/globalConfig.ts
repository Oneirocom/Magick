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
  isDirty: boolean
  layoutChangeEvent: boolean
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
    isDirty: false as boolean,
    layoutChangeEvent: false as boolean,
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
      action: PayloadAction<{ value: SaveDiffData; clearFuture: boolean }>
    ) => {
      if (!action.payload.value) return
      const MAX_HISTORY = 30

      if (state.pastState?.length >= MAX_HISTORY) {
        const newPastState = [...state.pastState].slice(1)
        state.pastState = newPastState
      }
      const newPastState = state.pastState?.length
        ? [...state.pastState, action.payload.value]
        : [action.payload.value]

      state.pastState = newPastState

      if (action.payload.clearFuture) {
        state.futureState = []
      }
    },
    undoState: (state: GlobalConfig) => {
      const MAX_ENTRIES = 30

      if (state.pastState.length > 0) {
        // Prepare updates separately
        const lastState = state.pastState[state.pastState.length - 1]
        //remove lastState from pastState
        const updatedPastState = [...state.pastState]

        //TODO: I think we are poping twice here because one is the current state. might have a bug somewhere
        updatedPastState.pop()
        updatedPastState.pop()

        // Prepend lastState to futureState and enforce MAX_ENTRIES limit
        const updatedFutureState = [...state.futureState, lastState].slice(
          0,
          MAX_ENTRIES
        )

        // Perform assignments
        state.pastState = updatedPastState
        state.futureState = updatedFutureState
      }
    },
    redoState: (state: GlobalConfig) => {
      const MAX_ENTRIES = 30
      if (state.futureState.length > 0) {
        // Prepare updates separately
        const nextState = state.futureState[state.futureState.length - 1]
        const updatedFutureState = [...state.futureState]
        updatedFutureState.pop()

        // Append nextState to pastState and enforce MAX_ENTRIES limit
        const updatedPastState = [nextState, ...state.pastState].slice(
          0,
          MAX_ENTRIES
        )
        // Perform assignments
        state.pastState = updatedPastState
        state.futureState = updatedFutureState
      }
    },
    setIsDirty: (state: GlobalConfig, action: PayloadAction<boolean>): void => {
      state.isDirty = action.payload
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
    setLayoutChangeEvent: (
      state: GlobalConfig,
      action: PayloadAction<boolean>
    ): void => {
      state.layoutChangeEvent = action.payload
    },
  },
})

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
  setLayoutChangeEvent,
  applyState,
  undoState,
  redoState,
  setIsDirty,
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
export const selectIsDirty = state => state.globalConfig.isDirty
export const selectLayoutChangeEvent = state =>
  state.globalConfig.layoutChangeEvent

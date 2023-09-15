// DOCUMENTED
/**
 * Module that exports a Redux slice for the global config that carries the authentication, project id and API url information.
 * @module globalConfigSlice
 */

import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

/**
 * Interface that defines the Global Config type.
 */
export interface GlobalConfig {
  apiUrl: string
  token: string
  projectId: string
  currentAgentId: string
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
    setCurrentAgentId: (
      state: GlobalConfig,
      action: PayloadAction<string>
    ): void => {
      state.currentAgentId = action.payload
    },
  },
})

// Actions
/**
 * Action to set the global configuration.
 */
export const { setConfig, setCurrentAgentId } = globalConfigSlice.actions

/**
 * Export GlobalConfigSlice reducer.
 */
export default globalConfigSlice.reducer

import { createSlice, Slice } from '@reduxjs/toolkit'

export interface GlobalConfig {
  apiUrl: string
  token: string
  projectId: string
}

export const globalConfigSlice: Slice<GlobalConfig> = createSlice({
  name: 'globalConfig',
  initialState: {
    apiUrl: '',
    token: '',
    projectId: '',
  },
  reducers: {
    setConfig: (state, action) => {
      const { apiUrl, token, projectId } = action.payload
      state.apiUrl = apiUrl
      state.token = token
      state.projectId = projectId
    },
  },
})

// actions
export const { setConfig } = globalConfigSlice.actions

export default globalConfigSlice.reducer

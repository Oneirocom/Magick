import { createSlice } from '@reduxjs/toolkit'

export interface GlobalConfig {
  apiUrl: string
  token: string
  projectId: string
}

export const globalConfigSlice = createSlice({
  name: 'globalConfig',
  initialState: {
    apiUrl: '',
    token: '',
    projectId: '',
  },
  reducers: {
    setConfig: (state, action) => {
      state = action.payload
    },
  },
})

// actions
export const { setConfig } = globalConfigSlice.actions

export default globalConfigSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

export interface Preference {
  autoSave: boolean
}

export const preferenceSlice = createSlice({
  name: 'preferences',
  initialState: {
    autoSave: true,
  },
  reducers: {
    toggleAutoSave: state => {
      const newState = state.autoSave === true ? false : true
      state.autoSave = newState
    },
  },
})

// actions
export const { toggleAutoSave } =
  preferenceSlice.actions

export default preferenceSlice.reducer

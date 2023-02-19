import { createSlice } from '@reduxjs/toolkit'

export interface Preference {
  autoSave: boolean
  doNotShowUnlockWarning: boolean
}

export const preferenceSlice = createSlice({
  name: 'preferences',
  initialState: {
    autoSave: true,
    doNotShowUnlockWarning: false,
  },
  reducers: {
    toggleAutoSave: state => {
      const newState = state.autoSave === true ? false : true
      state.autoSave = newState
    },
    toggleDoNotShowUnlockWarning: state => {
      const newState = state.doNotShowUnlockWarning === true ? false : true
      state.doNotShowUnlockWarning = newState
    },
  },
})

// actions
export const { toggleAutoSave, toggleDoNotShowUnlockWarning } =
  preferenceSlice.actions

export default preferenceSlice.reducer

import { combineReducers } from 'redux'

import { spellApi } from './api/spells'
import tabReducer from './tabs'
import localStateSlice from './localState'
import preferencesReducer from './preferences'

const reducers = combineReducers({
  tabs: tabReducer,
  preferences: preferencesReducer,
  [spellApi.reducerPath]: spellApi.reducer,
  localState: localStateSlice,
})

export default reducers

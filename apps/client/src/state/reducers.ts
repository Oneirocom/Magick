import { combineReducers } from 'redux'

import { spellApi } from './api/spells'
import { greetingsApi } from './api/greetings'
import tabReducer from './tabs'
import configreducer from './admin/config/configState'
import scopeSlice from './admin/scope/scopeState'
import clientSlice from './admin/clientS/clientState'
import localStateSlice from './localState'
import preferencesReducer from './preferences'

const reducers = combineReducers({
  tabs: tabReducer,
  preferences: preferencesReducer,
  [spellApi.reducerPath]: spellApi.reducer,
  [greetingsApi.reducerPath]: greetingsApi.reducer,
  config: configreducer,
  scope: scopeSlice,
  client: clientSlice,
  localState: localStateSlice,
})

export default reducers

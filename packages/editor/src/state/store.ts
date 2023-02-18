import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'

import {
  persistStore,
  persistReducer,
  // FLUSH,
  // REHYDRATE,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { getOrCreateSpellApi } from './api/spells'
import { getOrCreateRootApi } from './api/api'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'

import { combineReducers } from 'redux'

import tabReducer from './tabs'
import localStateSlice from './localState'
import preferencesReducer from './preferences'

let store: ToolkitStore | null = null
export const getOrCreateStore = config => {
  if (store) return store
  const spellApi = getOrCreateSpellApi(config)
  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: [spellApi.reducerPath],
  }

  const rootReducer = combineReducers({
    tabs: tabReducer,
    preferences: preferencesReducer,
    [spellApi.reducerPath]: spellApi.reducer,
    localState: localStateSlice,
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const rootApi = getOrCreateRootApi(config)
  store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        // serializableCheck: {
        //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // },
      }).concat(rootApi.middleware),
  })
  setupListeners(store.dispatch)
  return store
}

// TODO: fix hard types here and replace the any
// these types were causing a race condition on a lazy store load
// the lazy pattern is useful for letting the component be initialized from an external app
export type AppDispatch = any // typeof store.dispatch
export type RootState = ReturnType<any> // ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

import { projectId } from '@magickml/engine'
import { configureStore, ThunkAction, Action, Dispatch } from '@reduxjs/toolkit'
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
// import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { combineReducers } from 'redux'

import { spellApi } from './api/spells'
import { rootApi } from './api/api'
import tabReducer from './tabs'
import localStateReducer from './localState'
import preferencesReducer from './preferences'
import globalConfigReducer, { globalConfigSlice } from './globalConfig'
import { MagickIDEProps } from '../main'

const rootReducer = combineReducers({
  globalConfig: globalConfigReducer,
  tabs: tabReducer,
  preferences: preferencesReducer,
  [spellApi.reducerPath]: spellApi.reducer,
  localState: localStateReducer,
})

let _store = null
export const createStore = (config?: MagickIDEProps) => {
  if (_store) return _store

  const persistConfig = {
    key: config.projectId,
    version: 1,
    storage,
    blacklist: [spellApi.reducerPath, 'globalConfig'],
  }

  const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    // reducer: rootReducer,
    preloadedState: {
      globalConfig: config,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(rootApi.middleware),
  })

  setupListeners(store.dispatch)
  persistStore(store)

  _store = store

  return store
}
// export const persistedStore = persistStore(store)

// TODO: fix hard types here and replace the any
// these types were causing a race condition on a lazy store load
// the lazy pattern is useful for letting the component be initialized from an external app
export type AppDispatch = Dispatch
export type RootState = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

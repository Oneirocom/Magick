// DOCUMENTED
import { ThunkAction, Action, Dispatch, EnhancedStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { Reducer, combineReducers } from 'redux'

import { spellApi } from './api/spells'
import { rootApi } from './api/api'
import localStateReducer from './localState'
import preferencesReducer from './preferences'
import globalConfigReducer from './globalConfig'
import tabLayoutReducer from './tabLayoutState'
import statusBarReducer from './statusBarState'
import rootFeathers, { configureFeathersStore } from './feathers/root'
import { feathersEventMiddleware } from '@magickml/feathersRedux'
import { tabReducer } from './tabs/tabReducer'

// import { AppConfig } from '@magickml/client-core'

/**
 * Combine all reducers into the root reducer.
 */

const initialReducers = {
  [rootApi.reducerPath]: rootApi.reducer,
  [rootFeathers.rootReducerPath]: rootFeathers.reducer,
  tabLayout: tabLayoutReducer,
  globalConfig: globalConfigReducer,
  preferences: preferencesReducer,
  localState: localStateReducer,
  statusBar: statusBarReducer,
  graph: tabReducer,
}
const rootReducer = combineReducers(initialReducers)

// Extend the store type
export interface ExtendedStore extends EnhancedStore {
  asyncReducers: Record<string, Reducer>
}

// Store instance placeholder
let _store: any = null

/**
 * Create a new store with optional configuration.
 * @param config - Optional configuration for the store.
 * @returns The created store.
 */
export const createStore = (config?: any): ExtendedStore => {
  if (_store) return _store

  const persistConfig = {
    key: config.projectId,
    version: 1,
    storage,
    blacklist: [
      spellApi.reducerPath,
      rootFeathers.rootReducerPath,
      'globalConfig',
      'statusBar',
    ],
  }

  const store: ExtendedStore = configureFeathersStore({
    reducer: persistReducer(persistConfig, rootReducer),
    preloadedState: {
      globalConfig: config,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      })
        .concat(rootApi.middleware)
        .concat(feathersEventMiddleware),
  }) as ExtendedStore

  setupListeners(store.dispatch)
  persistStore(store)

  store.asyncReducers = {}

  _store = store

  return store
}

export const injectReducer = (
  store: ExtendedStore,
  key: string,
  asyncReducer: Reducer
) => {
  store.asyncReducers[key] = asyncReducer

  store.replaceReducer(
    combineReducers({
      ...initialReducers,
      ...store.asyncReducers,
    })
  )
}

interface DynamicState {
  [key: string]: typeof tabReducer | undefined
}

// Export types for the application's Redux store
export type AppDispatch = Dispatch
export type RootState = ReturnType<typeof rootReducer> & DynamicState
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

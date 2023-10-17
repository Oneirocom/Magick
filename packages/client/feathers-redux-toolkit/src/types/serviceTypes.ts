import type { Reducer, createSlice } from '@reduxjs/toolkit'
import { REGISTER_EVENTS } from '../lib/constants'
import { ServiceConfigType, SliceActions, StringKeyof } from './configtypes'

export type EventHook = () => {
  data: any[]
  lastItem: any
  error: any
}

export type EventHooks<ServiceName extends string, Events extends string[]> = {
  [K in Events[number] as `useSelect${Capitalize<ServiceName>}${Capitalize<K>}`]: EventHook
}

export type InjectServiceResult<
  ServiceName extends string,
  Events extends string[],
  Actions extends SliceActions
> = {
  reducer: Reducer
  actions: Actions
  registerFeathersEvents: () => {
    type: typeof REGISTER_EVENTS
    payload: { serviceName: ServiceName; events: Events }
  }
  selectors: EventHooks<ServiceName, Events>
}
export interface FeathersReduxInitialState {
  data: any[]
  item: any
  loading: boolean
}

export interface ServiceDetails {
  reducer: Reducer
  config: ServiceConfigType
}

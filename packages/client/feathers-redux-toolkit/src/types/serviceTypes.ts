import type { Reducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { REGISTER_EVENTS } from '../lib/constants'

export type StringKeyof<T> = Extract<keyof T, string>

export type SliceActions = ReturnType<typeof createSlice>['actions']

export type ActionName = StringKeyof<ReturnType<typeof createSlice>['actions']>

export type ActionNames = ActionName[]

export interface ServiceConfigType<
  N extends string = string,
  E extends string[] = string[]
> {
  name: N
  initialState?: Record<string, any>
  reducers?: Record<string, (state: any, action: PayloadAction<any>) => void>
  events: E
}

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

import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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

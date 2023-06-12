import {create} from 'zustand'
import {createSceneSlice} from './createSceneSlice'
import {createUISlice} from './createUISlice'


export const useZustand = create((set, get) => ({
  ...createUISlice(set, get),
  ...createSceneSlice(set, get),
}))

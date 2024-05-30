import { RootState } from '../store'
import graphSlice, { GraphState } from './graphSlice'

export const tabReducer = graphSlice

export const selectTabState = (tabId: string) => (state: RootState) =>
  state.graph[tabId] as GraphState

export const selectTabNodes = (tabId: string) => (state: RootState) => {
  const tabState = selectTabState(tabId)(state)
  return tabState?.nodes
}

export const selectTabNodesLength = (tabId: string) => (state: RootState) => {
  const tabState = selectTabState(tabId)(state)
  return tabState?.nodes.length
}

export const selectTabEdges = (tabId: string) => (state: RootState) => {
  const tabState = selectTabState(tabId)(state)
  return tabState?.edges
}

export const selectActiveNode = (tabId: string) => (state: RootState) => {
  const tabState = selectTabState(tabId)(state)
  return tabState?.nodes.find(node => node.selected)
}

export const selectGraphJson = (tabId: string) => (state: RootState) => {
  const tabState = selectTabState(tabId)(state)
  return tabState?.graphJson
}

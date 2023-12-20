import graphSlice, { GraphState } from './graphSlice'

export const tabReducer = graphSlice

export const selectTabState = tabId => state => state.graph[tabId] as GraphState

export const selectTabNodes = tabId => state => {
  const tabState = selectTabState(tabId)(state)
  return tabState?.nodes
}

export const selectTabEdges = tabId => state => {
  const tabState = selectTabState(tabId)(state)
  return tabState?.edges
}

export const selectActiveNode = tabId => state => {
  const tabState = selectTabState(tabId)(state)
  return tabState?.nodes.find(node => node.selected)
}

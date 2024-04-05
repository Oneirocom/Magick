import type { NodePickerFilters } from './types'
import { NodeCategory, type NodeSpecJSON } from '@magickml/behave-graph'
import { useMemo } from 'react'

interface UseFilteredAndGroupedNodesProps {
  specJSON: NodeSpecJSON[]
  filters: NodePickerFilters
  search: string
}

export const useFilteredAndGroupedNodes = ({
  specJSON,
  filters,
  search,
}: UseFilteredAndGroupedNodesProps) => {
  // Utility function to combine node sockets with configuration defaults
  const combineSocketsWithDefaults = (
    node: NodeSpecJSON,
    socketType: keyof NodeSpecJSON
  ) => [
    ...node[socketType],
    ...(node.configuration
      .filter(
        c =>
          c.name ===
          `socket${socketType.charAt(0).toUpperCase() + socketType.slice(1)}`
      )
      .flatMap(c => c.defaultValue) || []),
  ]

  // Filter nodes based on the presence of filters or a search term
  const filteredNodes = useMemo(
    () =>
      specJSON.filter(node => {
        if (filters) {
          const sockets = combineSocketsWithDefaults(
            node,
            filters.handleType === 'source' ? 'outputs' : 'inputs'
          )
          return sockets.some(socket => socket.valueType === filters.valueType)
        } else {
          const term = search.toLowerCase()
          return node.type.toLowerCase().includes(term)
        }
      }),
    [specJSON, filters, search]
  )

  // If category is 'None' we want to check the typeParts and then handles those in a case
  const getGroup = (node: NodeSpecJSON) => {
    if (node.category === 'None') {
      switch (node.type.split('/')[0]) {
        case 'action': {
          return NodeCategory.Action
        }
        case 'logic': {
          return NodeCategory.Logic
        }
        case 'math': {
          return NodeCategory.Logic
        }
        case 'flow': {
          return NodeCategory.Flow
        }
        case 'time': {
          return NodeCategory.Time
        }
        case 'event': {
          return NodeCategory.Event
        }
        default: {
          console.log('No category found for node', node.type.split('/')[0])
        }
      }
    }
    return node.category
  }

  const groupedData = useMemo(() => {
    if (!search) {
      return filteredNodes.reduce((result: any[], node) => {
        const category = getGroup(node)

        // let categoryGroup = result.find(item => item.title === category)
        let categoryGroup = result.find(item => item.title === category)
        if (!categoryGroup) {
          categoryGroup = { title: category, subItems: [] }
          result.push(categoryGroup)
        }

        categoryGroup?.subItems.push(node)

        return result
      }, [])
    } else {
      return []
    }
  }, [filteredNodes, search])

  return { filteredNodes, groupedData }
}

export default useFilteredAndGroupedNodes

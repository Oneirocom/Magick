"use client"

import { NodeCategory } from '@magickml/behave-graph'
import { useMemo } from 'react'

export const useFilteredAndGroupedNodes = ({ specJSON, filters, search }) => {
  // Utility function to combine node sockets with configuration defaults
  const combineSocketsWithDefaults = (node, socketType) => [
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
        // Apply search term to node type, make sure to handle cases where search is undefined or empty
        const matchesSearch = search
          ? node.type.toLowerCase().includes(search.toLowerCase())
          : true

        if (filters) {
          const sockets = combineSocketsWithDefaults(
            node,
            filters.handleType === 'source' ? 'outputs' : 'inputs'
          )
          // Ensure node matches both the socket filter and the search term
          return (
            matchesSearch &&
            sockets.some(socket => socket.valueType === filters.valueType)
          )
        } else {
          // If there are no filters, return nodes based on search term match
          return matchesSearch
        }
      }),
    [specJSON, filters, search] // Ensure useMemo dependencies are correctly listed
  )

  // If category is 'None' we want to check the typeParts and then handles those in a case
  const getGroup = node => {
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
      return filteredNodes.reduce((result, node) => {
        const category = getGroup(node)

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

import { NodeCategory } from '@magickml/behave-graph'
import { useMemo } from 'react'
import { ItemType } from './types'

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

  // Group the filtered nodes when not searching
  const groupedData = useMemo(() => {
    if (!search) {
      return filteredNodes.reduce((result, node) => {
        let category = node.category
        const typeParts = node.type.split('/')
        if (category === NodeCategory.None) {
          category = (typeParts[0][0].toUpperCase() +
            typeParts[0].slice(1)) as NodeCategory
        }
        const subcategory = typeParts[2] || typeParts[1]

        let categoryGroup = result.find(item => item.title === category)
        if (!categoryGroup) {
          categoryGroup = { title: category, subItems: [] }
          result.push(categoryGroup)
        }

        if (subcategory) {
          let subcategoryGroup = categoryGroup.subItems.find(
            item => 'title' in item && item.title === subcategory
          ) as ItemType
          if (!subcategoryGroup) {
            subcategoryGroup = { title: subcategory, subItems: [] }
            categoryGroup.subItems.push(subcategoryGroup)
          }
          subcategoryGroup.subItems.push(node)
        } else {
          categoryGroup.subItems.push(node)
        }

        return result
      }, [])
    } else {
      return []
    }
  }, [filteredNodes, search])

  return { filteredNodes, groupedData }
}

export default useFilteredAndGroupedNodes

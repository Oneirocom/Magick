import React, { useEffect, useRef, useState } from 'react'
import { useReactFlow, XYPosition } from 'reactflow'

import { useOnPressKey } from '../../../hooks/react-flow/useOnPressKey'
import { NodeCategory, NodeSpecJSON } from '@magickml/behave-graph'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../../../../ui/src/lib/core/ui'
import { handleKeyDown } from './handleKeyDown'
import { NodeItem } from './NodeItem'
import { ItemType, NodePickerProps } from './types'

export const NodePicker: React.FC<NodePickerProps> = ({
  position,
  pickedNodePosition,
  onPickNode,
  onClose,
  filters,
  specJSON,
}: NodePickerProps) => {
  const [search, setSearch] = useState('')
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [accordionOpenIndex, setAccordionOpenIndex] = useState<number | null>(
    null
  )
  const [innerFocusedIndex, setInnerFocusedIndex] = useState<number | null>(
    null
  )
  const instance = useReactFlow()

  useOnPressKey('Escape', onClose)

  let filteredNodes = specJSON || []
  let groupedData: ItemType[] = []

  // Extract and combine inputs or outputs with configuration defaults.
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

  // Filter nodes based on the presence of filters or a search term.
  filteredNodes = filteredNodes.filter(node => {
    if (filters) {
      // Determine whether to use inputs or outputs based on the handleType.
      const sockets = combineSocketsWithDefaults(
        node,
        filters.handleType === 'source' ? 'outputs' : 'inputs'
      )
      // Check if any of the sockets match the filter's valueType.
      return sockets.some(socket => socket.valueType === filters.valueType)
    } else {
      // Lowercase comparison for type-based search.
      const term = search.toLowerCase()
      return node.type.toLowerCase().includes(term)
    }
  })

  if (!search) {
    groupedData = filteredNodes.reduce<ItemType[]>((result, node) => {
      let category = node.category
      const typeParts = node.type.split('/')
      if (category === NodeCategory.None) {
        // Assuming you want to reassign category based on type parts if category is 'None'
        category = (typeParts[0][0].toUpperCase() +
          typeParts[0].slice(1)) as NodeCategory
      }
      const subcategory = typeParts[2] || typeParts[1]

      // Find or create category group.
      let categoryGroup = result.find(item => item.title === category)
      if (!categoryGroup) {
        categoryGroup = { title: category, subItems: [] }
        result.push(categoryGroup)
      }

      // Handle subcategory logic.
      if (subcategory) {
        let subcategoryGroup = categoryGroup.subItems.find(
          item => 'title' in item && item.title === subcategory
        ) as ItemType
        if (!subcategoryGroup) {
          subcategoryGroup = { title: subcategory, subItems: [] }
          categoryGroup.subItems.push(subcategoryGroup)
        }
        // Assume subItems can contain NodeSpecJSON directly for subcategories
        subcategoryGroup.subItems.push(node)
      } else {
        // Directly add node to category if no subcategory is defined
        categoryGroup.subItems.push(node)
      }
      return result
    }, [])
  }

  return (
    <div
      className="fixed z-10 w-[240px] text-sm text-white border border-gray-500 rounded-sm bg-[var(--secondary-3)] "
      style={{ top: position.y, left: position.x }}
    >
      <div className="p-2">
        <input
          type="text"
          autoFocus
          placeholder="Search"
          className="w-full bg-[var(--dark-2)] disabled:bg-gray-700 rounded-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {search ? (
        <>
          <div className="p-2 text-xs text-gray-400">
            Press <span className="font-bold">Tab</span> to autocomplete
          </div>
          <div className="overflow-y-scroll max-h-[320px] w-full">
            {filteredNodes.map(({ type }, index) => (
              <div
                key={type}
                className={`p-2 cursor-pointer border-b border-[var(--secondary-3)] ${
                  index === focusedIndex ? 'bg-[#282d33]' : 'hover:bg-[#282d33]'
                }`}
                onMouseEnter={() => setFocusedIndex(index)}
                onClick={() => {
                  if (!pickedNodePosition) return
                  return onPickNode(type, instance.project(pickedNodePosition))
                }}
              >
                <div className="">{type}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        pickedNodePosition && (
          <div className="max-h-[320px] overflow-y-scroll w-full">
            <Accordion type="multiple">
              {groupedData.map((item, index) => (
                <NodeItem
                  index={index}
                  key={item.title + index}
                  item={item}
                  onPickNode={onPickNode}
                  position={pickedNodePosition}
                  focusedIndex={focusedIndex}
                />
              ))}
            </Accordion>
          </div>
        )
      )}
    </div>
  )
}

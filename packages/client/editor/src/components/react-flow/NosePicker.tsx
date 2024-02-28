import React, { useEffect, useState } from 'react'
import { useReactFlow, XYPosition } from 'reactflow'

import { useOnPressKey } from '../../hooks/react-flow/useOnPressKey'
import { NodeSpecJSON } from '@magickml/behave-graph'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../../../ui/src/lib/core/ui'
export type NodePickerFilters = {
  handleType: 'source' | 'target'
  valueType: string
}

type NodePickerProps = {
  position: XYPosition
  pickedNodePosition: XYPosition | undefined
  filters?: NodePickerFilters
  onPickNode: (type: string, position: XYPosition) => void
  onClose: () => void
  specJSON: NodeSpecJSON[] | undefined
}

type ItemType = {
  title: string
  type?: string
  subItems: ItemType[] | NodeSpecJSON[]
}

type Props = {
  item: ItemType
  onPickNode: Function
  position: XYPosition
}

export const NosePicker: React.FC<NodePickerProps> = ({
  position,
  pickedNodePosition,
  onPickNode,
  onClose,
  filters,
  specJSON,
}: NodePickerProps) => {
  const [search, setSearch] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const instance = useReactFlow()

  useOnPressKey('Escape', onClose)

  // Your existing filter logic
  let filtered = specJSON || []
  let groupedData = [] as ItemType[]

  if (filters !== undefined) {
    filtered = filtered?.filter(node => {
      const inputs = [
        ...node.inputs,
        ...(node?.configuration
          .filter(c => c.name === 'socketInputs')
          .flatMap(c => c.defaultValue) || []),
      ]
      const outputs = [
        ...node.outputs,
        ...(node?.configuration
          .filter(c => c.name === 'socketOutputs')
          .flatMap(c => c.defaultValue) || []),
      ]

      const sockets = filters?.handleType === 'source' ? outputs : inputs
      return sockets.some(socket => socket.valueType === filters?.valueType)
    })
  }

  filtered =
    filtered?.filter(node => {
      const term = search.toLowerCase()
      return node.type.toLowerCase().includes(term)
    }) || []

  // Autocomplete logic
  const autocompleteSearchTerm = () => {
    if (!filtered || search.length === 0 || filtered?.length === 0) return

    // Filter to only include items that start with the current search term
    const relevantItems = filtered.filter(node =>
      node.type.toLowerCase().startsWith(search.toLowerCase())
    )

    if (relevantItems.length === 0) return

    // Function to find the longest common prefix among an array of strings
    const findLongestCommonPrefix = arr => {
      if (arr.length === 0) return ''

      let prefix = arr[0]
      for (let i = 1; i < arr.length; i++) {
        while (arr[i].indexOf(prefix) !== 0) {
          prefix = prefix.substring(0, prefix.length - 1)
          if (prefix === '') return ''
        }
      }
      return prefix
    }

    // Find the longest common prefix that extends the current search term
    const longestCommonPrefix = findLongestCommonPrefix(
      relevantItems.map(item => item.type)
    )

    if (longestCommonPrefix.length > search.length) {
      setSearch(longestCommonPrefix)
    }
  }
  // Keyboard navigation logic
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        autocompleteSearchTerm()
      }

      if (event.key === 'ArrowDown') {
        setFocusedIndex(prev => Math.min(prev + 1, filtered.length - 1))
      } else if (event.key === 'ArrowUp') {
        setFocusedIndex(prev => Math.max(prev - 1, 0))
      } else if (
        event.key === 'Enter' &&
        filtered.length > 0 &&
        pickedNodePosition
      ) {
        onPickNode(
          filtered[focusedIndex].type,
          instance.project(pickedNodePosition)
        )
        onClose() // Close the picker after selection
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [filtered, focusedIndex, onPickNode, instance, position, onClose])

  // Group the nodes by category and subcategory when not searching
  if (!search) {
    groupedData = filtered.reduce((result, node) => {
      const typeParts = node.type.split('/')
      let category = node.category as string
      let subcategory: string | undefined = undefined

      if (category === 'None') {
        category = typeParts[0].charAt(0).toUpperCase() + typeParts[0].slice(1)
        subcategory = typeParts[2] ? typeParts[2] : typeParts[1]
      }

      let categoryIndex = result.findIndex(item => item.title === category)
      if (categoryIndex === -1) {
        result.push({ title: category, subItems: [] })
        categoryIndex = result.length - 1
      }

      if (subcategory) {
        let subcategoryIndex = result[categoryIndex].subItems.findIndex(
          item => item.title === subcategory
        )
        if (subcategoryIndex === -1) {
          ;(result[categoryIndex].subItems as ItemType[]).push({
            title: subcategory,
            subItems: [],
          })
          subcategoryIndex = result[categoryIndex].subItems.length - 1
        }
        ;(
          (result[categoryIndex].subItems[subcategoryIndex] as ItemType)
            .subItems as NodeSpecJSON[]
        ).push(node)
      } else {
        ;(result[categoryIndex].subItems as NodeSpecJSON[]).push(node)
      }

      return result
    }, [] as ItemType[])
  }

  const Item = ({ item, position, onPickNode }: Props) => {
    const instance = useReactFlow()

    const handleClick = e => {
      e.stopPropagation() // Prevent the accordion from toggling when a node is picked
      if (item.type) {
        onPickNode(item.type, instance.project(position))
      }
    }

    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className=" py-0  border-b border-black"
      >
        <AccordionTrigger className="py-2 px-2 ">
          {item.title ?? item?.type}
        </AccordionTrigger>
        {item.subItems &&
          item.subItems.map(subitem => {
            return (
              <AccordionContent className="py-2 px-2 border-b-0 border-t border-black">
                {subitem.type || 'TEST'}
              </AccordionContent>
            )
          })}
      </AccordionItem>
    )
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
            {filtered.map(({ type }, index) => (
              <div
                key={type}
                className={`p-2 cursor-pointer border-b border-[var(--secondary-3)] ${
                  index === focusedIndex ? 'bg-gray-700' : 'hover:bg-gray-600'
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
              {groupedData.map(item => (
                <Item
                  key={item.title}
                  item={item}
                  onPickNode={onPickNode}
                  position={pickedNodePosition}
                />
              ))}
            </Accordion>
          </div>
        )
      )}
    </div>
  )
}

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
  id: string
  index: number
}

export const NodePicker: React.FC<NodePickerProps> = ({
  position,
  pickedNodePosition,
  onPickNode,
  onClose,
  filters,
  specJSON,
}: NodePickerProps) => {
  const [search, setSearch] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [accordionOpen, setAccordionOpen] = useState(null) // Track if any accordion is open
  const [innerFocusedIndex, setInnerFocusedIndex] = useState(-1) // Focused index within an accordion

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

    const relevantItems = filtered.filter(node =>
      node.type.toLowerCase().includes(search.toLowerCase())
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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const accordionItem = document.getElementById(
          `accordion-item-${focusedIndex}`
        )
        if (accordionItem) {
          const accordionTrigger = document.getElementById(
            `accordion-trigger-${focusedIndex}`
          )
          if (accordionTrigger) {
            console.log('clicking')
            accordionTrigger.click()
          }
        }
      }

      if (event.key === 'Tab') {
        event.preventDefault()
        autocompleteSearchTerm()
      } else if (!search) {
        // Navigation logic for accordion titles and contents
        navigateAccordions(event)
      } else {
        // Navigation logic for search results
        navigateSearchResults(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [search, focusedIndex, accordionOpen, groupedData, autocompleteSearchTerm])

  // Navigation through accordion titles or contents based on accordionOpen state
  const navigateAccordions = event => {
    let newIndex = focusedIndex
    const totalItems = groupedData.length

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      // Logic to navigate accordion titles or inner contents
      if (accordionOpen === null) {
        // Navigate through accordion titles
        newIndex = (focusedIndex + 1) % totalItems
      } else {
        // Navigate within the opened accordion's contents
        const maxInnerIndex = groupedData[accordionOpen].subItems.length - 1
        setInnerFocusedIndex(current =>
          current + 1 > maxInnerIndex ? 0 : current + 1
        )
        return
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      // Similar logic for ArrowUp
      if (accordionOpen === null) {
        newIndex = (focusedIndex - 1 + totalItems) % totalItems
      } else {
        const maxInnerIndex = groupedData[accordionOpen].subItems.length - 1
        setInnerFocusedIndex(current =>
          current - 1 < 0 ? maxInnerIndex : current - 1
        )
        return
      }
    }

    setFocusedIndex(newIndex)
    // Scroll the focused accordion title into view
    scrollToItem(`accordion-item-${newIndex}`)
  }

  // Navigation through search results
  const navigateSearchResults = event => {
    let newIndex = focusedIndex
    const totalItems = filtered.length

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      newIndex = (focusedIndex + 1) % totalItems
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      newIndex = (focusedIndex - 1 + totalItems) % totalItems
    } else if (event.key === 'Enter' && totalItems > 0 && pickedNodePosition) {
      // Trigger selection
      onPickNode(
        filtered[focusedIndex].type,
        instance.project(pickedNodePosition)
      )
      onClose()
      return
    }

    setFocusedIndex(newIndex)
    scrollToItem(`search-item-${newIndex}`)
  }

  // Helper function to scroll the item into view
  const scrollToItem = itemId => {
    const itemElement = document.getElementById(itemId)
    if (itemElement) {
      itemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

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

  const Item = ({ item, position, onPickNode, id, index }: Props) => {
    const instance = useReactFlow()

    const handleClick = ({ i }) => {
      if (i.type) {
        onPickNode(i.type, instance.project(position))
      }
    }

    return (
      <AccordionItem
        id={id}
        key={item.title}
        value={item.title}
        className={`py-0 border-b border-black ${
          index === focusedIndex ? 'bg-[#282d33]' : ''
        }
        }`}
      >
        <AccordionTrigger
          id={`accordion-trigger-${index}`}
          className="py-2 px-2"
          iconPosition="start"
        >
          {item.title ?? item?.type}
        </AccordionTrigger>
        {item.subItems &&
          item.subItems.map(subitem => {
            return (
              <AccordionContent
                onClick={e => {
                  e.stopPropagation()
                  handleClick({ i: subitem })
                }}
                className="py-2 pr-2 pl-6 border-b-0 border-t border-black hover:underline hover:bg-[#282d33] cursor-pointer"
              >
                {subitem.type}
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
                id={`search-item-${index}`} // Assigning ID based on index
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
                <Item
                  id={`accordion-item-${index}`}
                  index={index}
                  key={item.title + index}
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

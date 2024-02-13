import { NodeSpecJSON } from '@magickml/behave-graph'
import React, { useEffect, useState } from 'react'
import { useReactFlow, XYPosition } from 'reactflow'
import { useOnPressKey } from '../../hooks/react-flow/useOnPressKey'
import styles from './nodePicker.module.scss'
export type NodePickerFilters = {
  handleType: 'source' | 'target'
  valueType: string
}

type NodePickerProps = {
  position: XYPosition
  pickedNodePosition: XYPosition
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

const Item = ({ item, position, onPickNode }: Props) => {
  const instance = useReactFlow()
  const [visibleSubitems, setVisibleSubitems] = useState(false)

  const handleClick = () => {
    if (item.type) {
      onPickNode(item.type, instance.project(position))
    }
  }

  return (
    <div
      className={
        'p-2 capitalize text-base border-b border-gray-600 cursor-pointer ' +
        styles['item'] +
        ' ' +
        (item.subItems ? styles['hasSubitems'] : '')
      }
      key={item.title}
      onClick={handleClick}
      onMouseOver={() => setVisibleSubitems(true)}
      onMouseLeave={() => setVisibleSubitems(false)}
    >
      {item.title ?? (item?.type && item?.type.split('/')[1])}
      {item.subItems && visibleSubitems && (
        <div className={styles['subitems']}>
          {item.subItems.map(subitem => (
            <Item
              key={subitem.title}
              item={subitem}
              onPickNode={onPickNode}
              position={position}
            />
          ))}
        </div>
      )}
    </div>
  )
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
      } else if (event.key === 'Enter' && filtered.length > 0) {
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

  return (
    <div
      className="fixed z-10 text-sm text-white bg-gray-800 border border-gray-500 rounded node-picker "
      style={{ top: position.y, left: position.x }}
    >
      <div className="p-2 bg-gray-500">Add Node</div>
      <div className="p-2">
        <input
          type="text"
          autoFocus
          placeholder="Type to filter"
          className="w-full px-2 py-1 bg-gray-600 disabled:bg-gray-700"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {search && (
        <>
          <div className="p-2 text-xs text-gray-400">
            Press <span className="font-bold">Tab</span> to autocomplete
          </div>
          <div className="overflow-y-scroll max-h-48">
            {filtered.map(({ type }, index) => (
              <div
                key={type}
                className={`p-2 text-base cursor-pointer border-b border-gray-600 ${
                  index === focusedIndex ? 'bg-gray-700' : 'hover:bg-gray-600'
                }`}
                onMouseEnter={() => setFocusedIndex(index)}
                onClick={() =>
                  onPickNode(type, instance.project(pickedNodePosition))
                }
              >
                {type}
              </div>
            ))}
          </div>
        </>
      )}
      {!search && (
        <div className={styles['context-menu']}>
          {groupedData.map(item => (
            <Item
              key={item.title}
              item={item}
              onPickNode={onPickNode}
              position={pickedNodePosition}
            />
          ))}
        </div>
      )}
    </div>
  )
}

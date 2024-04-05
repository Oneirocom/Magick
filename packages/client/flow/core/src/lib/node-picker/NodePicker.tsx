import React, { useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { useOnPressKey } from '../hooks/useOnPressKey'
import { SearchResults } from './SearchResults'
import { NodePickerMenu } from './NodePickerMenu'
import useFilteredAndGroupedNodes from './useFilteredAndGroupedNodes'
import { autoCompleteSearchTerm } from './autoCompleteSearchTerm'
import { NodePickerProps } from './types'
import { Input } from '@magickml/client-ui'

export const NodePicker: React.FC<NodePickerProps> = ({
  pickedNodePosition,
  onPickNode,
  onClose,
  filters,
  specJSON,
  position,
}: NodePickerProps) => {
  const [search, setSearch] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const instance = useReactFlow()

  useOnPressKey('Escape', onClose)

  const { filteredNodes, groupedData } = useFilteredAndGroupedNodes({
    specJSON: specJSON || [],
    filters: filters || { handleType: 'source', valueType: '' },
    search,
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        autoCompleteSearchTerm({
          filteredNodes,
          search,
          setSearch,
        })
      }
      if (event.key === 'ArrowDown') {
        setFocusedIndex(prev => (prev + 1) % filteredNodes.length)
      }
      if (event.key === 'ArrowUp') {
        setFocusedIndex(
          prev => (prev - 1 + filteredNodes.length) % filteredNodes.length
        )
      }
      if (event.key === 'Enter') {
        if (pickedNodePosition) {
          onPickNode(
            filteredNodes[focusedIndex]?.type,
            instance.project(pickedNodePosition)
          )
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    filteredNodes,
    groupedData,
    search,
    setSearch,
    focusedIndex,
    pickedNodePosition,
    onPickNode,
  ])

  return (
    <div
      className="fixed z-10 w-[240px] text-sm text-white border-2 border-[var(--ds-black)] rounded-md bg-[var(--ds-card-alt)] py-1"
      style={{ top: position.y, left: position.x }}
    >
      <div className="text-md px-2 py-1 font-bold">Node Selection</div>
      <div className="px-2 pb-1">
        <Input
          type="text"
          autoFocus
          placeholder="Search"
          className="w-full bg-[#282d33] disabled:bg-gray-700 rounded-md py-1 focus:ring-1 focus:ring[--ds-primary] focus:outline-none focus-visible:ring-1 focus-visible:ring-[--ds-primary] focus-visible:outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {search && (
        <SearchResults
          filteredNodes={filteredNodes}
          onPickNode={onPickNode}
          instance={instance}
          focusedIndex={focusedIndex}
          setFocusedIndex={setFocusedIndex}
          pickedNodePosition={pickedNodePosition}
        />
      )}
      {pickedNodePosition && (
        <NodePickerMenu
          groupedData={groupedData}
          onPickNode={onPickNode}
          pickedNodePosition={pickedNodePosition}
          instance={instance}
        />
      )}
    </div>
  )
}

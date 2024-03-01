import React, { useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'

import { useOnPressKey } from '../../../hooks/react-flow/useOnPressKey'

import { SearchResults } from './SearchResults'
import { NodePickerMenu } from './NodePickerMenu'
import useFilteredAndGroupedNodes from './useFilteredAndGroupedNodes'
import { autoCompleteSearchTerm } from './autoCompleteSearchTerm'
import { NodePickerProps } from './types'

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
    specJSON,
    filters,
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
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [filteredNodes, groupedData, search, setSearch])

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

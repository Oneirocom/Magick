'use client'

import React, { useEffect, useState } from 'react'
import { useReactFlow } from '@xyflow/react'

import { useOnPressKey } from '../hooks/useOnPressKey'

import { SearchResults } from './SearchResults'
import { NodePickerMenu } from './NodePickerMenu'
import useFilteredAndGroupedNodes from './useFilteredAndGroupedNodes'
import { autoCompleteSearchTerm } from './autoCompleteSearchTerm'
import { NodePickerProps } from './types'
import { Input } from '@magickml/client-ui'
import { getNodeSpec } from 'shared/nodeSpec'
import { MagickEdgeType, MagickNodeType } from '@magickml/client-types'

export const NodePicker: React.FC<NodePickerProps> = ({
  pickedNodePosition,
  onPickNode,
  onClose,
  filters,
  specJSON,
  position,
  spell,
}: NodePickerProps) => {
  const [search, setSearch] = useState('')
  const [nodeSpecs, setNodeSpecs] = useState(specJSON)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const instance = useReactFlow<MagickNodeType, MagickEdgeType>()

  useOnPressKey('Escape', onClose)

  // We need to recreate the node specs here with the spell to populate variable nodes
  // This is to prevent the spell form rerendering the graph every time a variable changes.
  // So we isolate the variable nodes to the node picker
  useEffect(() => {
    if (!specJSON) return
    const nodeSpecs = getNodeSpec(spell)
    setNodeSpecs(nodeSpecs)
  }, [specJSON, spell])

  const { filteredNodes, groupedData } = useFilteredAndGroupedNodes({
    specJSON: nodeSpecs,
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
          onPickNode(filteredNodes[focusedIndex]?.type, pickedNodePosition)
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

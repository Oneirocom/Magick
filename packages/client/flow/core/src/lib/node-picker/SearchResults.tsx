'use client'

import { NodeSpecJSON } from '@magickml/behave-graph'
import { MagickReactFlowInstance } from '@magickml/flow-core'
import { XYPosition } from '@xyflow/react'
import { useEffect, useRef } from 'react'

export const SearchResults = ({
  filteredNodes,
  focusedIndex,
  setFocusedIndex,
  pickedNodePosition,
  onPickNode,
  instance,
}: {
  filteredNodes: NodeSpecJSON[]
  focusedIndex: number
  setFocusedIndex: (index: number) => void
  pickedNodePosition: XYPosition | undefined
  onPickNode: (type: string, position: XYPosition) => void
  instance: MagickReactFlowInstance
}) => {
  const resultsRef = useRef<HTMLDivElement>(null)
  const focusedItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focusedItemRef.current) {
      focusedItemRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIndex])

  return (
    <>
      <div className="p-2 text-xs text-gray-400">
        Press <span className="font-bold">Tab</span> to autocomplete
      </div>
      <div ref={resultsRef} className="overflow-y-auto max-h-[320px] w-full">
        {filteredNodes.map(({ type }, index) => (
          <div
            key={type}
            ref={index === focusedIndex ? focusedItemRef : null}
            className={`p-2 cursor-pointer border-b border-[var(--secondary-3)] ${
              index === focusedIndex ? 'bg-[#282d33]' : 'hover:bg-[#282d33]'
            }`}
            onMouseEnter={() => setFocusedIndex(index)}
            onClick={e => {
              e.stopPropagation()
              if (!pickedNodePosition) return
              onPickNode(type, pickedNodePosition)
            }}
          >
            <div className="">{type}</div>
          </div>
        ))}
      </div>
    </>
  )
}

'use client'

import { MagickReactFlowInstance } from '../flow'
import { NodeItem } from './NodeItem'
import { XYPosition } from '@xyflow/react'
import { ItemType } from './types'

export const NodePickerMenu = ({
  groupedData,
  onPickNode,
  pickedNodePosition,
  instance,
}: {
  groupedData: any
  onPickNode: (type: string, position: XYPosition) => void
  pickedNodePosition: XYPosition
  instance: MagickReactFlowInstance
}) => {
  return (
    <div className="max-h-[320px] overflow-y-scroll w-full">
      {groupedData.map((item: ItemType | undefined, index: number) => {
        const isLast = index === groupedData.length - 1
        return (
          <div key={index}>
            <NodeItem
              index={index}
              key={'node-item' + index}
              item={item}
              onPickNode={onPickNode}
              pickedNodePosition={pickedNodePosition}
              instance={instance}
            />
            {!isLast && (
              <div
                key={index + 'divider'}
                className="border-b border-black w-full"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

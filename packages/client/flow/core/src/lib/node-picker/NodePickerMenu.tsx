import { NodeItem } from './NodeItem'
import { ReactFlowInstance, XYPosition } from 'reactflow'

export const NodePickerMenu = ({
  groupedData,
  onPickNode,
  pickedNodePosition,
  instance,
}: {
  groupedData: any[]
  onPickNode: (type: string, position: XYPosition) => void
  pickedNodePosition: XYPosition
  instance: ReactFlowInstance
}) => {
  return (
    <div className="max-h-[320px] overflow-y-scroll w-full">
      {groupedData.map((item, index) => {
        const isLast = index === groupedData.length - 1
        return (
          <>
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
          </>
        )
      })}
    </div>
  )
}

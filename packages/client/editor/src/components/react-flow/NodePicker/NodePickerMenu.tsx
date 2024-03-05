import { Accordion } from '@magickml/client-ui'
import { NodeItem } from './NodeItem'
import { XYPosition } from 'reactflow'

export const NodePickerMenu = ({
  groupedData,
  onPickNode,
  pickedNodePosition,
  instance,
}: {
  groupedData: any
  onPickNode: (type: string, position: XYPosition) => void
  pickedNodePosition: XYPosition
  instance: any
}) => {
  return (
    <div className="max-h-[320px] overflow-y-scroll w-full">
      <Accordion type="multiple">
        {groupedData.map((item, index) => (
          <NodeItem
            index={index}
            key={item.title + index}
            item={item}
            onPickNode={onPickNode}
            pickedNodePosition={pickedNodePosition}
            instance={instance}
          />
        ))}
      </Accordion>
    </div>
  )
}

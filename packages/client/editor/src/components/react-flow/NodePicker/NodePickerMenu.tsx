import { Accordion } from '@magickml/client-ui'
import { NodeItem } from './NodeItem'

export const NodePickerMenu = ({
  groupedData,
  onPickNode,
  pickedNodePosition,
  setActiveCategories,
  activeCategories,
  lastClickedCategory,
  setLastClickedCategory,
}: {
  groupedData: any
  onPickNode: any
  pickedNodePosition: any
  setActiveCategories: any
  activeCategories: string[]
  lastClickedCategory: string
  setLastClickedCategory: any
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
            position={pickedNodePosition}
            setActiveCategories={setActiveCategories}
            activeCategories={activeCategories}
            lastClickedCategory={lastClickedCategory}
            setLastClickedCategory={setLastClickedCategory}
          />
        ))}
      </Accordion>
    </div>
  )
}

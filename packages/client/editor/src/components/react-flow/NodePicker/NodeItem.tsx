import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@magickml/client-ui'
import { XYPosition } from 'reactflow'
import { ItemType } from './types'

export const NodeItem = ({
  item,
  pickedNodePosition,
  onPickNode,
  index,
  instance,
}: {
  item: ItemType | undefined
  pickedNodePosition: XYPosition
  onPickNode: (type: string, position: XYPosition) => void
  index: number
  instance: any
}) => {
  const handleClick = ({ item }) => {
    onPickNode(item, instance.project(pickedNodePosition))
  }

  if (!item) return <></>
  return (
    <AccordionItem
      key={item.title + index}
      value={item.title}
      className={`py-0 border-b border-black`}
    >
      <AccordionTrigger
        className={`py-2 px-2
        data-[state=open]:bg-[#282d33] hover:bg-[#282d33] cursor-pointer transition-all border-b border-black hover:underline`}
        iconPosition="start"
      >
        {item.title ?? item?.type}
      </AccordionTrigger>
      {item?.subItems &&
        item.subItems.map((subItem: Partial<ItemType>) => {
          const sub = subItem?.subItems?.flatMap(subItem => subItem.type)
          return (
            <AccordionContent
              key={subItem.title}
              onClick={e => {
                e.stopPropagation()
                handleClick({ item: sub })
              }}
              className={`py-2 pr-2 pl-6 border-b-0 border-t border-black hover:underline hover:bg-[#282d33] cursor-pointer`}
            >
              {sub}
            </AccordionContent>
          )
        })}
    </AccordionItem>
  )
}

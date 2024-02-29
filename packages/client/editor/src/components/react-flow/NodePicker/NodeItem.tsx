import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@magickml/client-ui'
import { XYPosition, useReactFlow } from 'reactflow'
import { ItemType } from './types'

export const NodeItem = ({
  item,
  position,
  onPickNode,
  index,
  focusedIndex,
}: {
  item: ItemType
  position: XYPosition
  onPickNode: any
  index: number
  focusedIndex: number
}) => {
  const instance = useReactFlow()

  const handleClick = ({ i }) => {
    if (i.type) {
      onPickNode(i.type, instance.project(position))
    }
  }
  return (
    <AccordionItem
      key={item.title}
      value={item.title}
      className={`py-0 border-b border-black ${
        index === focusedIndex ? 'bg-[#282d33]' : ''
      }`}
    >
      <AccordionTrigger className="py-2 px-2" iconPosition="start">
        {item.title ?? item?.type}
      </AccordionTrigger>
      {item?.subItems &&
        item.subItems.map((subItem: Partial<ItemType>) => {
          const sub = subItem?.subItems?.flatMap(subItem => subItem.type)
          return (
            <AccordionContent
              onClick={e => {
                e.stopPropagation()
                handleClick({ i: subItem })
              }}
              className="py-2 pr-2 pl-6 border-b-0 border-t border-black hover:underline hover:bg-[#282d33] cursor-pointer"
            >
              {sub}
            </AccordionContent>
          )
        })}
    </AccordionItem>
  )
}

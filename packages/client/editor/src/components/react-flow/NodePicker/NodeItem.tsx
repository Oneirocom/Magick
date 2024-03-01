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
  setActiveCategories,
  activeCategories,
  // lastClickedCategory,
  setLastClickedCategory,
}: {
  item: ItemType
  position: XYPosition
  onPickNode: any
  index: number
  setActiveCategories: any
  activeCategories: string[]
  lastClickedCategory: string
  setLastClickedCategory: any
}) => {
  const instance = useReactFlow()

  const handleClick = ({ i }) => {
    if (i.type) {
      onPickNode(i.type, instance.project(position))
    }
  }

  const categoryOpen = activeCategories.includes(item.title)
  return (
    <AccordionItem
      key={item.title + index}
      value={item.title}
      className={`py-0 border-b border-black`}
    >
      <AccordionTrigger
        className={`py-2 px-2 ${
          categoryOpen && `bg-[#282d33]`
        } hover:bg-[#282d33] cursor-pointer transition-all border-b border-black hover:underline`}
        iconPosition="start"
        onClick={() => {
          setActiveCategories([...activeCategories, item.title])
          setLastClickedCategory(item.title)
          if (activeCategories.includes(item.title)) {
            setActiveCategories(
              activeCategories.filter(category => category !== item.title)
            )
          }
        }}
      >
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
              className={`py-2 pr-2 pl-6 border-b-0 border-t border-black hover:underline hover:bg-[#282d33] cursor-pointer`}
            >
              {sub}
            </AccordionContent>
          )
        })}
    </AccordionItem>
  )
}

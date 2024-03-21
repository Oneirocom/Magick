import * as Collapsible from '@radix-ui/react-collapsible'
import { XYPosition } from 'reactflow'
import { ItemType } from './types'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

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
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = ({ item }) => {
    onPickNode(item, instance.project(pickedNodePosition))
  }

  if (!item) return <></>

  return (
    <Collapsible.Root
      key={item.title + index}
      className="py-0 w-full"
      onOpenChange={setIsOpen}
    >
      <Collapsible.Trigger className="py-1 px-2 data-[state=open]:bg-[var(--ds-black)] hover:bg-[var(--ds-black)] cursor-pointer transition-all w-full hover:underline flex items-center justify-start">
        <ChevronDownIcon
          className={`w-4 h-4 mr-2 ml-1 transition-transform duration-200 ${
            !isOpen ? 'rotate-0' : 'rotate-[-90deg]'
          }`}
        />
        <span>{item.title ?? item?.type}</span>
      </Collapsible.Trigger>
      <Collapsible.Content>
        {item?.subItems &&
          item.subItems.map((subItem: Partial<ItemType>) => {
            return (
              <div
                key={subItem?.title ?? subItem?.type}
                onClick={e => {
                  e.stopPropagation()
                  handleClick({ item: subItem?.type })
                }}
                className="py-2 pr-2 pl-6 border-b-0 border-t border-black hover:underline hover:bg-[#282d33] cursor-pointer"
              >
                <span className="ml-[14%]">
                  {subItem.title ?? subItem?.type}
                </span>
              </div>
            )
          })}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

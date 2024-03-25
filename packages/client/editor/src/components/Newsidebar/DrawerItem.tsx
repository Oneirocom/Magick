import * as React from 'react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@magickml/client-ui'

// DrawerItem component properties
type DrawerItemProps = {
  Icon: React.ElementType
  open?: boolean
  text: string
  active: boolean
  onClick?: () => void
  tooltipText: string
}

/**
 * The DrawerItem component used to display individual items in the main drawer.
 */
export const DrawerItem: React.FC<DrawerItemProps> = ({
  Icon,
  open = true,
  text,
  active,
  onClick,
  tooltipText,
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center px-1 py-0.2 cursor-pointer ${
            active ? 'text-primary' : 'text-white'
          }`}
          onClick={onClick}
        >
          <div
            className={`flex items-center justify-center mr-${
              open ? '2' : 'auto'
            } min-w-0`}
          >
            <Icon />
          </div>
          {open && <span className="opacity-100">{text}</span>}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8} className="w-auto">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

import { Menu, MenuItem } from '@mui/material'
import { memo } from 'react'
import { XYPosition } from 'reactflow'

type Action = {
  label: string
  onClick: () => void
}

type ContextNodeMenuProps = {
  isOpen: boolean
  position: XYPosition | undefined
  actions: Action[]
  onClose: () => void
}

export const ContextNodeMenu = memo(
  ({ isOpen, position, actions, onClose }: ContextNodeMenuProps) => {
    return (
      <Menu
        classes={{
          list: '!p-0 cursor-pointer bg-gray-800 w-40',
        }}
        anchorReference="anchorPosition"
        anchorPosition={{ top: position?.y || 0, left: position?.x || 0 }}
        open={isOpen}
        onClose={onClose}
      >
        {actions.map(action => (
          <MenuItem
            key={action.label}
            onClick={() => {
              action.onClick()
              onClose()
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    )
  }
)

import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'

// DrawerItem component properties
type DrawerItemProps = {
  Icon: React.ElementType
  open?: boolean
  text: string
  tooltip: string
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
  <ListItem key={text} disablePadding sx={{ display: 'block' }}>
    <Tooltip title={tooltipText} placement="top" enterDelay={500} arrow>
      <ListItemButton
        sx={{
          py: 0.2,
          justifyContent: open ? 'initial' : 'center',
          px: 1,
        }}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 2 : 'auto',
            justifyContent: 'center',
            color: active ? 'var(--primary)' : 'white',
          }}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </Tooltip>
  </ListItem>
)
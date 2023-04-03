import { ClientPluginManager, pluginManager } from '@magickml/core'
import AppsIcon from '@mui/icons-material/Apps'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import BoltIcon from '@mui/icons-material/Bolt'
import DocumentIcon from '@mui/icons-material/Description'
import SettingsIcon from '@mui/icons-material/Settings'
import StorageIcon from '@mui/icons-material/Storage'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { CSSObject, styled, Theme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SetAPIKeys } from './SetAPIKeys'
import ChatIcon from '@mui/icons-material/Chat'

import MagickLogo from './purple-logo-full.png'
import MagickLogoSmall from './purple-logo-small.png'
import ProjectWindow from './ProjectWindow'

// Constants
const drawerWidth = 150

// CSS mixins for open and close states
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(3)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(5)} + 1px)`,
  },
})

// DrawerHeader component properties
type HeaderProps = {
  open: boolean
}

/**
 * The DrawerHeader component style definition based on its open state property.
 */
const DrawerHeader = styled('div', {
  shouldForwardProp: prop => prop !== 'open',
})<HeaderProps>(({ theme, open }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  left: 3,
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

/**
 * The StyledDrawer component style definition based on its open state property.
 */
const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

// DrawerItem component properties
type DrawerItemProps = {
  Icon: any
  open: boolean
  text: string
  active: boolean
  onClick?: () => void
}

/**
 * The DrawerItem component used to display individual items in the main drawer.
 */
const DrawerItem: React.FC<DrawerItemProps> = ({
  Icon,
  open,
  text,
  active,
  onClick,
}) => (
  <ListItem key={text} disablePadding sx={{ display: 'block' }}>
    <ListItemButton
      sx={{
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
      }}
      onClick={onClick}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 2 : 'auto',
          justifyContent: 'center',
          color: active ? 'var(--glow)' : 'white',
        }}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
    </ListItemButton>
  </ListItem>
)

// PluginDrawerItems component properties
type PluginDrawerItemsProps = {
  onClick: (path: string) => () => void
  open: boolean
}

/**
 * The PluginDrawerItems component used to display plugin-related drawer items.
 */
const PluginDrawerItems: React.FC<PluginDrawerItemsProps> = ({
  onClick,
  open,
}) => {
  const location = useLocation()
  const drawerItems = (pluginManager as ClientPluginManager).getDrawerItems()
  let lastPlugin: string | null = null
  let divider = false
  return (
    <>
      {drawerItems.map((item, index) => {
        if (item.plugin !== lastPlugin) {
          divider = true
          lastPlugin = item.plugin
        } else {
          divider = false
        }
        return (
          <div key={item.path}>
            {divider && <Divider />}
            <DrawerItem
              key={item.path}
              active={location.pathname.includes(item.path)}
              Icon={item.icon}
              open={open}
              onClick={onClick(item.path)}
              text={item.text}
            />
          </div>
        )
      })}
    </>
  )
}

/**
 * The main Drawer component that wraps around the application content.
 */
export function Drawer({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAPIKeysSet, setAPIKeysSet] = useState(false)
  const [openDrawer, setOpenProjectDrawer] = useState(false)
  const [open, setOpen] = useState<boolean>(false)

  // Function to toggle drawer state
  const toggleDrawer = () => {
    if (!open) setOpenProjectDrawer(false)
    setOpen(!open)
  }

  // Function to handle navigation based on location path
  const onClick = location => () => {
    navigate(location)
  }

  useEffect(() => {
    const secrets = localStorage.getItem('secrets')
    if (secrets) {
      let secretHasBeenSet = false
      const parsedSecrets = JSON.parse(secrets)
      Object.keys(parsedSecrets).forEach(key => {
        if (parsedSecrets[key] !== '' && parsedSecrets[key]) {
          secretHasBeenSet = true
        }
      })
      setAPIKeysSet(secretHasBeenSet)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key.toLowerCase() === 'h' && event.ctrlKey) {
        setOpenProjectDrawer(prevState => !prevState)
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader
          open={open}
          onClick={toggleDrawer}
          sx={{ justifyContent: open ? 'space-between' : 'flex-end' }}
        >
          {
            <img
              style={{
                marginLeft: open ? '.5em' : '.0em',
                marginTop: '2em',
                height: 16,
                cursor: 'pointer',
              }}
              src={open ? MagickLogo : MagickLogoSmall}
              onClick={toggleDrawer}
              alt=""
            />
          }
        </DrawerHeader>
        <List
          sx={{
            padding: 0,
          }}
        >
          <DrawerItem
            active={
              location.pathname.includes('/magick') ||
              location.pathname.includes('/home')
            }
            Icon={AutoFixHighIcon}
            open={open}
            onClick={onClick('/magick')}
            text="Spells"
          />
          <DrawerItem
            active={location.pathname === '/agents'}
            Icon={AppsIcon}
            open={open}
            onClick={onClick('/agents')}
            text="Agents"
          />
          <DrawerItem
            active={location.pathname === '/documents'}
            Icon={DocumentIcon}
            open={open}
            onClick={onClick('/documents')}
            text="Documents"
          />
          <DrawerItem
            active={location.pathname === '/requests'}
            Icon={BoltIcon}
            open={open}
            onClick={onClick('/events')}
            text="Events"
          />
          <DrawerItem
            active={location.pathname === '/requests'}
            Icon={StorageIcon}
            open={open}
            onClick={onClick('/requests')}
            text="Requests"
          />
          <Divider />
          <DrawerItem
            active={location.pathname.includes('/chat')}
            Icon={ChatIcon}
            open={open}
            onClick={onClick('/chat')}
            text="Chat"
          />
          <Divider />
          <PluginDrawerItems onClick={onClick} open={open} />
          <Divider />
          <DrawerItem
            active={location.pathname.includes('/settings')}
            Icon={SettingsIcon}
            open={open}
            onClick={onClick('/settings')}
            text="Settings"
          />
          {!isAPIKeysSet && <SetAPIKeys />}
        </List>
      </StyledDrawer>
      <ProjectWindow openDrawer={openDrawer} />
      {children}
    </div>
  )
}

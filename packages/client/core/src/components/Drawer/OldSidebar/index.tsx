// DOCUMENTED
import { ClientPluginManager, pluginManager } from 'shared/core'
import AppsIcon from '@mui/icons-material/Apps'
import ArticleIcon from '@mui/icons-material/Article'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import BoltIcon from '@mui/icons-material/Bolt'
import SettingsIcon from '@mui/icons-material/Settings'
import StorageIcon from '@mui/icons-material/Storage'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { CSSObject, Theme, styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ProjectWindowProvider,
  useProjectWindow,
} from '../../../../../providers/src/lib/ProjectWindowProvider'
import ProjectWindow from '../ProjectWindow'
import { SetAPIKeys } from '../SetAPIKeys'
import MagickLogo from '../logo-full.png'
import MagickLogoSmall from '../logo-small.png'
import { Tooltip } from '@mui/material'
import { drawerTooltipText } from '../tooltiptext'
import { STANDALONE } from 'shared/config'

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
  theme?: Theme
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
})(({ theme, open }: HeaderProps) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme as Theme),
    '& .MuiDrawer-paper': openedMixin(theme as Theme),
  }),
  ...(!open && {
    ...closedMixin(theme as Theme),
    '& .MuiDrawer-paper': closedMixin(theme as Theme),
  }),
}))

// DrawerItem component properties
type DrawerItemProps = {
  Icon: React.ElementType
  open: boolean
  text: string
  tooltip: string
  active: boolean
  onClick?: () => void
  tooltipText: string
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
  tooltipText,
}) => (
  <ListItem key={text} disablePadding sx={{ display: 'block' }}>
    <Tooltip title={tooltipText} placement="top" enterDelay={500} disableInteractive arrow>
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
      {drawerItems.map(item => {
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
              tooltip="Avatar and Tasks Tooltip"
              tooltipText={item.tooltip}
            />
          </div>
        )
      })}
    </>
  )
}

type DrawerProps = {
  children: React.ReactNode
}

/**
 * The main Drawer component that wraps around the application content.
 */
export function OldSidebar({ children }: DrawerProps): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const { openProjectWindow, openDrawer, setOpenDrawer, setOpenProjectWindow } =
    useProjectWindow()
  const [isAPIKeysSet, setAPIKeysSet] = useState(false)

  // Function to toggle drawer state
  const onMagickLogoClick = () => {
    if (STANDALONE) {
      if (!openDrawer) setOpenProjectWindow(false)
      setOpenDrawer(!openDrawer)
    } else {
      window.parent.postMessage({ type: 'redirect', href: '/projects' }, '*')
    }
  }

  // Function to handle navigation based on location path
  const onClick = (location: string) => () => {
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'b' && event.ctrlKey) {
        setOpenProjectWindow(prevState => !prevState)
        setOpenDrawer(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <StyledDrawer variant="permanent" open={openDrawer}>
        <DrawerHeader
          open={openDrawer}
          onClick={onMagickLogoClick}
          sx={{ justifyContent: openDrawer ? 'space-between' : 'flex-end' }}
        >
          <img
            style={{
              marginLeft: openDrawer ? '.5em' : '.0em',
              marginTop: '2em',
              height: 16,
              cursor: 'pointer',
            }}
            src={openDrawer ? MagickLogo : MagickLogoSmall}
            alt=""
          />
        </DrawerHeader>
        <List
          sx={{
            padding: 0,
          }}
        >
          <DrawerItem
            active={
              location.pathname.includes('/magick') ||
              location.pathname.includes('/home') ||
              location.pathname === '/'
            }
            Icon={AutoFixHighIcon}
            open={openDrawer}
            onClick={onClick('/magick')}
            text="Spells"
            tooltip="Spells Tooltip"
            tooltipText={drawerTooltipText.spells}
          />
          <DrawerItem
            active={location.pathname === '/agents'}
            Icon={AppsIcon}
            open={openDrawer}
            onClick={onClick('/agents')}
            text="Agents"
            tooltip="Agents Tooltip"
            tooltipText={drawerTooltipText.agents}
          />
          <DrawerItem
            active={location.pathname === '/documents'}
            Icon={ArticleIcon}
            open={openDrawer}
            onClick={onClick('/documents')}
            text="Documents"
            tooltip="Documents Tooltip"
            tooltipText={drawerTooltipText.documents}
          />
          <DrawerItem
            active={location.pathname === '/events'}
            Icon={BoltIcon}
            open={openDrawer}
            onClick={onClick('/events')}
            text="Events"
            tooltip="Events Tooltip"
            tooltipText={drawerTooltipText.events}
          />
          <DrawerItem
            active={location.pathname === '/requests'}
            Icon={StorageIcon}
            open={openDrawer}
            onClick={onClick('/requests')}
            text="Requests"
            tooltip="Requests Tooltip"
            tooltipText={drawerTooltipText.requests}
          />
          <Divider />
          <PluginDrawerItems onClick={onClick} open={openDrawer} />
          <Divider />
          <DrawerItem
            active={location.pathname.includes('/settings')}
            Icon={SettingsIcon}
            open={openDrawer}
            onClick={onClick('/settings')}
            text="Settings"
            tooltip="Settings Tooltip"
            tooltipText={drawerTooltipText.settings}
          />
          {!isAPIKeysSet && <SetAPIKeys />}
        </List>
      </StyledDrawer>
      {openProjectWindow && <ProjectWindow openDrawer={openProjectWindow} />}
    </div>
  )
}

export const DrawerProvider = ({ children }: DrawerProps) => {
  return (
    <ProjectWindowProvider>
      <OldSidebar> {children}</OldSidebar>
    </ProjectWindowProvider>
  )
}

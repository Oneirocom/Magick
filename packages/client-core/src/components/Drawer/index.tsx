import { pluginManager } from '@magickml/engine'
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
import { body, title } from '../../constants'
import InfoDialog from '../InfoDialog'

import MagickLogo from './purple-logo-full.png'
import MagickLogoSmall from './purple-logo-small.png'

const drawerWidth = 150

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

type HeaderProps = {
  open: boolean
}

const DrawerHeader = styled('div', {
  shouldForwardProp: prop => prop !== 'open',
})<HeaderProps>(({ theme, open }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  left: 3,
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

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

const DrawerItem = ({ Icon, open, text, active, onClick = () => { /* null handler */ } }) => (
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

const PluginDrawerItems = ({ onClick, open }) => {
  const location = useLocation()
  const drawerItems = pluginManager.getDrawerItems()
  let lastPlugin = null
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

export function Drawer({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpenAPISet, setOpenAPISet] = useState(true)

  const [open, setOpen] = useState<boolean>(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const onClick = location => () => {
    navigate(location)
  }

  useEffect(() => {
    const secrets = localStorage.getItem('secrets')
    if (secrets) {
      const parsedSecrets = JSON.parse(secrets)
      setOpenAPISet(!!parsedSecrets['openai_api_key'])
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
                // on hover, show the finger cursor
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
            active={location.pathname === '/events'}
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
          <PluginDrawerItems onClick={onClick} open={open} />
          <Divider />
          <DrawerItem
            active={location.pathname.includes('/settings')}
            Icon={SettingsIcon}
            open={open}
            onClick={onClick('/settings')}
            text="Settings"
          />
          {!isOpenAPISet && (
            <InfoDialog
              title={title}
              body={body}
              style={{
                width: '100%',
                height: '1px',
                marginLeft: '89%',
                marginTop: '-40%',
              }}
            />
          )}
        </List>
      </StyledDrawer>
      {children}
    </div>
  )
}

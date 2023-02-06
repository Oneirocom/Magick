import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useState } from 'react'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { useLocation } from 'react-router-dom'
import StorageIcon from '@mui/icons-material/Storage'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import HubIcon from '@mui/icons-material/Hub'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import Card from '@mui/material/Card'

import MagickLogo from './Magick-purple-logo.png'

const drawerWidth = 240

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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  left: 3,
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, {
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

const DrawerItem = ({ Icon, open, text, active, onClick = () => {} }) => (
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

export default function MiniDrawer({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [open, setOpen] = useState<boolean>(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const onClick = location => () => {
    navigate(location)
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader open={open} onClick={toggleDrawer} sx={{justifyContent: open ? "normal" : "flex-end"}}>
        {!open ? <IconButton>
           <MenuIcon />
          </IconButton>
         : <img style={{
          height: 16,
          // on hover, show the finger cursor
          cursor: 'pointer',
         
         }} src={MagickLogo} onClick={toggleDrawer} alt="" />}
        </DrawerHeader>
        <List
          sx={{
            padding: 0,
          }}
        >
          <DrawerItem
            active={location.pathname === '/magick'}
            Icon={AutoFixHighIcon}
            open={open}
            onClick={onClick('/magick')}
            text="Spells"
          />
          {/* <DrawerItem
            active={location.pathname === '/spellbook'}
            Icon={AutoStoriesIcon}
            open={open}
            text="Spellbook"
          /> */}
          <DrawerItem
            active={location.pathname === '/events'}
            Icon={StorageIcon}
            open={open}
            onClick={onClick('/events')}
            text="Events"
          />
          <DrawerItem
            active={location.pathname === '/apps'}
            Icon={HubIcon}
            open={open}
            onClick={onClick('/apps')}
            text="Applications"
          />
          <DrawerItem
            active={location.pathname === '/searchCorpus'}
            Icon={ManageSearchIcon}
            onClick={onClick('/searchCorpus')}
            open={open}
            text="Search Corpus"
          />
          {/* <DrawerItem
            active={location.pathname === '/settings'}
            Icon={SettingsIcon}
            open={open}
            text="Settings"
          /> */}
        </List>
        {/* <Divider /> */}
      </Drawer>
      {children}
    </div>
  )
}

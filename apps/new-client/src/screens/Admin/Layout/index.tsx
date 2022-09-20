import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import SettingsIcon from '@mui/icons-material/Settings'
import { Outlet } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { NavLink, useLocation } from 'react-router-dom'

const drawerWidth = 240

const StyledLink = styled(NavLink)({
  textDecoration: 'none',
  color: 'white',
})

const AdminDashboard = () => {
  const location = useLocation()
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Thoth
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(70, 70, 70, 0.95)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <StyledLink to={'config'}>
              <ListItem selected={location.pathname === '/admin/config'} button>
                <ListItemIcon>
                  <ToggleOffIcon />
                </ListItemIcon>
                <ListItemText primary="Config" />
              </ListItem>
            </StyledLink>
            <StyledLink to={'clientSettings'}>
              <ListItem
                selected={location.pathname === '/admin/clientSettings'}
                button
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Client Settings" />
              </ListItem>
            </StyledLink>
            <StyledLink to={'scope'}>
              <ListItem selected={location.pathname === '/admin/scope'} button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Scope" />
              </ListItem>
            </StyledLink>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default AdminDashboard

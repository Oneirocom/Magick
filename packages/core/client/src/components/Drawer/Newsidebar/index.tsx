// DOCUMENTED
import { ClientPluginManager, pluginManager } from '@magickml/core'
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
import { useTreeData } from '../../../contexts/TreeDataProvider'
import { SetAPIKeys } from '../SetAPIKeys'
import { Tooltip, Typography } from '@mui/material'
import { drawerTooltipText } from '../tooltiptext'
import AgentMenu from '../AgentMenu'
import { CssBaseline } from '@mui/material'
import { DndProvider } from 'react-dnd'
import {
  Tree,
  NodeModel,
  MultiBackend,
  getBackendOptions,
} from '@minoru/react-dnd-treeview'
import styles from '../menu.module.css'
import { CustomNode } from '../CustomNode'
import AddIcon from '@mui/icons-material/Add'
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import Menu from '@mui/material/Menu'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import { useConfig } from '@magickml/client-core'
import { DEFAULT_USER_TOKEN, STANDALONE, PRODUCTION } from '@magickml/config'
import { useDispatch, useSelector } from 'react-redux'

// todo FIX THIS IMPORT
import { useTabLayout } from '../../../../../../editor/src/contexts/TabProvider'

const drawerWidth = 210

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
  width: '0px'
})

// DrawerHeader component properties
type HeaderProps = {
  open: boolean
  theme?: Theme
}

type CustomData = {
  fileType: string
  fileSize: string
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 7,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1BC5EB',
  },
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
  const { openTab } = useTabLayout()
  const location = useLocation()
  const drawerItems = (pluginManager as ClientPluginManager).getDrawerItems()
  let lastPlugin: string | null = null
  let divider = false
  return (
    drawerItems.map(item => {
      if (item.plugin !== lastPlugin) {
        divider = false
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
            onClick={() => {
              openTab({
                name: item.text,
                type: item.text,
                switchActive: true,
                id: item.text,
              })
            }}
            text={item.text}
            tooltip="Avatar and Tasks Tooltip"
            tooltipText={item.tooltip}
          />
        </div>
      )
    })
  )
}

type DrawerProps = {
  children: React.ReactNode
}

/**
 * The main Drawer component that wraps around the application content.
 */
export function NewSidebar(DrawerProps): JSX.Element {
  const { openTab } = useTabLayout()
  const location = useLocation()
  const navigate = useNavigate()
  const [isAPIKeysSet, setAPIKeysSet] = useState(false)
  const [openDrawer] = useState<boolean>(true)
  // State to keep track of the anchor element of the menu and cursor position
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const config = useConfig()
  const [data, setData] = useState([])
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const { treeData, setTreeData,
    setAgentUpdate } = useTreeData()
  const handleDrop = (newTree: NodeModel[]) => {
    setTreeData(newTree)
  }

  // Function to handle navigation based on location path
  const onClick = (location: string) => () => {
    navigate(location)
  }

  //create new default agent
  const createNew = (data: {
    projectId: string
    rootSpell?: string
    enabled: boolean
    name: string
    updatedAt?: string
    publicVariables: string
    secrets: string
    default: boolean
  }) => {
    if (!token && PRODUCTION) {
      return
    }

    fetch(`${config.apiUrl}/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString(),
        pingedAt: new Date().toISOString(),
      }),
    })
      .then(async res => {
        const res2 = await fetch(
          `${config.apiUrl}/agents?projectId=${config.projectId}`,
          {
            headers: STANDALONE
              ? { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }
              : { Authorization: `Bearer ${token}` },
          }
        )
        const json = await res2.json()
        setData(json.data)
      })
      .catch(err => {
        console.error('error is', err)
      })
  }

  const resetData = async () => {
    const res = await fetch(
      `${config.apiUrl}/agents?projectId=${config.projectId}`,
      {
        headers: STANDALONE
          ? { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }
          : { Authorization: `Bearer ${token}` },
      }
    )
    const json = await res.json()
    setData(json.data)
    setAgentUpdate(true)
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
    if (!config.apiUrl) return
      ; (async () => {
        const res = await fetch(
          `${config.apiUrl}/agents?projectId=${config.projectId}`,
          {
            headers: STANDALONE
              ? { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }
              : { Authorization: `Bearer ${token}` },
          }
        )
        const json = await res.json()
        // if data.length === 0  create new agent
        if (json.data.length === 0) {
          await createNew({
            name: "Default Agent",
            projectId: config.projectId,
            enabled: false,
            publicVariables: '{}',
            secrets: '{}',
            default: true,
          })
          setData(json.data)
        } else {
          setData(json.data)
        }

        // setIsLoading(false)
      })()
  }, [config?.apiUrl])

  // Function to handle the click event on the hideMenu div
  const handleHideMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setMenuAnchorEl(event.currentTarget)
    setCursorPosition({ x: event.clientX, y: event.clientY })
  }

  // Function to handle closing the menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  // Effect to add a click listener to the document to close the menu when clicked outside
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (menuAnchorEl && !menuAnchorEl.contains(event.target as Node)) {
        handleMenuClose()
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [menuAnchorEl])

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <AgentMenu data={data} resetData={resetData} />

      <List
        sx={{
          padding: 0,
        }}
      >
        <DrawerItem
          active={location.pathname === '/events'}
          Icon={BoltIcon}
          open={openDrawer}
          onClick={() => {
            openTab({
              name: 'Events',
              type: 'Events',
              switchActive: true,
              id: 'events',
            })
          }}
          text="Events"
          tooltip="Events Tooltip"
          tooltipText={drawerTooltipText.events}
        />
        <DrawerItem
          active={location.pathname === '/requests'}
          Icon={StorageIcon}
          open={openDrawer}
          onClick={() => {
            openTab({
              name: 'Requests',
              type: 'Requests',
              switchActive: true,
              id: 'requests',
            })
          }}
          text="Requests"
          tooltip="Requests Tooltip"
          tooltipText={drawerTooltipText.requests}
        />

        <PluginDrawerItems onClick={onClick} open={openDrawer} />

        <DrawerItem
          active={location.pathname.includes('/settings')}
          Icon={SettingsIcon}
          open={openDrawer}
          onClick={() => {
            openTab({
              name: 'Settings',
              type: 'Settings',
              switchActive: true,
              id: 'settings',
            })
          }}
          text="Settings"
          tooltip="Settings Tooltip"
          tooltipText={drawerTooltipText.settings}
        />
        {!isAPIKeysSet && <SetAPIKeys />}
      </List>
      <Divider sx={{ marginY: 2 }} />

      <div className={styles.files}>
        <CssBaseline />
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <div>
            <Tree
              tree={treeData}
              rootId={0}
              // @ts-ignore
              render={(
                node: NodeModel<CustomData>,
                { depth, isOpen, onToggle }
              ) => (
                <CustomNode
                  openTab={openTab}
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  onToggle={onToggle}
                />
              )}
              onDrop={handleDrop}
              classes={{
                root: styles.treeRoot,
                draggingSource: styles.draggingSource,
                dropTarget: styles.dropTarget,
              }}
            />
          </div>
        </DndProvider>
      </div>
      <div className={styles.menu} style={{ color: '#7D7D7D' }}>
        <div className={styles.menuFlex}>
          <AddIcon sx={{ mr: 1 }} />
          <Typography variant="body1">Notion (coming soon)</Typography>
        </div>
        <div className={styles.menuFlex}>
          <AddIcon sx={{ mr: 1 }} />
          <Typography variant="body1">
            Google Drive (coming soon)
          </Typography>
        </div>
      </div>
      <div
        className={styles.hideMenu}
        onClick={handleHideMenuClick}
        style={{ cursor: 'pointer' }} // Add cursor style to indicate the clickable element
      >
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={
            menuAnchorEl
              ? { top: cursorPosition.y, left: cursorPosition.x }
              : undefined
          }
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          sx={{
            '& .MuiMenu-paper': {
              background: '#2B2B30',
              width: '180px',
              shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: '0px',
            },
          }}
        >
          <div className={styles.hideMenuItem}>
            <FolderOpenOutlinedIcon sx={{ mr: 1 }} />
            <Typography variant="body1">New Folder</Typography>
          </div>
          <Divider />
          <div
            className={styles.hideMenuItem}
            onClick={() => {
              navigate('/home/create-new')
            }}
          >
            <StarBorderPurple500OutlinedIcon sx={{ mr: 1 }} />
            <Typography variant="body1">New Spell</Typography>
          </div>
          <Divider />
          <div className={styles.hideMenuItem}>
            <HistoryEduOutlinedIcon sx={{ mr: 1 }} />
            <Typography variant="body1"> New Prompt</Typography>
          </div>
          <Divider />
          <div
            className={styles.hideMenuItem}
            onClick={() => {
              navigate(
                `/magick/Documents-${encodeURIComponent(btoa('Documents'))}`
              )
            }}
          >
            <DescriptionOutlinedIcon sx={{ mr: 1 }} />
            <Typography variant="body1">New Document</Typography>
          </div>
        </Menu>
      </div>
      <div className={styles.credits}>
        <div className={styles.menuFlex}>
          <AutoAwesomeIcon sx={{ mr: 1 }} />
          <Typography variant="body1">MP</Typography>
        </div>
        <BorderLinearProgress variant="determinate" value={50} />
        <p className={styles.creditCount}>300/500 monthly MP</p>
      </div>
    </div>
  )
}

export const DrawerProvider = ({ children }: DrawerProps) => {
  return (
    <NewSidebar> {children}</NewSidebar>
  )
}

// DOCUMENTED
import BoltIcon from '@mui/icons-material/Bolt'
import SettingsIcon from '@mui/icons-material/Settings'
import StorageIcon from '@mui/icons-material/Storage'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTreeData } from '@magickml/providers'
import { Typography } from '@mui/material'
import { CssBaseline } from '@mui/material'
import { DndProvider } from 'react-dnd'

import {
  Tree,
  NodeModel,
  MultiBackend,
  getBackendOptions,
} from '@minoru/react-dnd-treeview'
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
import { useSelector } from 'react-redux'

import { useConfig } from '@magickml/providers'
import { DEFAULT_USER_TOKEN, STANDALONE, PRODUCTION } from 'shared/config'
import { CustomNode } from './CustomNode'
import { AgentMenu } from './AgentMenu'
import { PluginDrawerItems } from './PluginDrawerItems'
import { SetAPIKeys, drawerTooltipText } from 'client/core'
import styles from './menu.module.css'

import { useTabLayout } from '@magickml/providers'
import { DrawerItem } from './DrawerItem'
import { ScreenLinkItems } from './ScreenLinkItems'

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
  // State to keep track of the anchor element of the menu and cursor position
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const config = useConfig()
  const [data, setData] = useState([])
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const { treeData, setTreeData, setAgentUpdate } = useTreeData()

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
            name: 'Default Agent',
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
      <AgentMenu data={data} resetData={resetData} />a

      <ScreenLinkItems isAPIKeysSet={isAPIKeysSet} />
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
          <Typography variant="body1" style={{ whiteSpace: 'nowrap' }}>
            Notion (coming soon)
          </Typography>
        </div>
        <div className={styles.menuFlex}>
          <AddIcon sx={{ mr: 1 }} />
          <Typography variant="body1" style={{ whiteSpace: 'nowrap' }}>
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
              openTab({
                name: 'Documents',
                type: 'Documents',
                switchActive: true,
                id: 'Documents',
              })
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
  return <NewSidebar> {children}</NewSidebar>
}

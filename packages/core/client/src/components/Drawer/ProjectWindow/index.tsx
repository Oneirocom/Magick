// DOCUMENTED
/** @module ProjectWindow */

import { API_ROOT_URL, DEFAULT_USER_TOKEN, PRODUCTION } from '@magickml/core'
import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Drawer,
  IconButton,
  Box,
} from '@mui/material'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
  Apps,
  TextSnippet,
  MoreHoriz,
  MenuBook,
  FileDownload,
  FileUpload,
  ExpandMore,
  ChevronRight,
} from '@mui/icons-material'
import FileInput from '../../FileInput/FileInput'
import styles from './index.module.scss'

let isResizing = false
const drawerMaxSize = 200

/**
 * ProjectWindow is a collapsible sidebar that shows a tree view of the project content.
 * It also provides import and export functionality for projects.
 *
 * @param {Object} props - The component's properties
 * @param {boolean} props.openDrawer - Whether the drawer is open or not
 */
const ProjectWindow = ({ openDrawer }) => {
  const globalConfig = useSelector(state => state.globalConfig)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [data, setData] = useState({ agents: [], spells: [], documents: [] })
  const [loaded, setLoaded] = useState(false)
  const token = globalConfig?.token
  const headers = PRODUCTION
    ? { Authorization: `Bearer ${token}` }
    : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  /**
   * Load file and upload its contents to the server.
   *
   * @param {File} selectedFile - Selected file object
   */
  const loadFile = selectedFile => {
    if (!token && PRODUCTION) {
      enqueueSnackbar('You must be logged in to create a project', {
        variant: 'error',
      })
      return
    }
    const fileReader = new FileReader()
    fileReader.readAsText(selectedFile)
    fileReader.onload = event => {
      const data = JSON.parse(event?.target?.result)

      console.log('data', data)

      delete data['id']
      axios({
        url: `${globalConfig.apiUrl}/projects`,
        method: 'POST',
        data: { ...data, projectId: globalConfig.projectId },
        headers,
      })
        .then(async res => {
          const res2 = await fetch(
            `${globalConfig.apiUrl}/projects?projectId=${globalConfig.projectId}`,
            { headers }
          )
          const json = await res2.json()
          setData(json)
        })
        .catch(err => {
          console.error('error is', err)
        })
    }
    handleClose()
  }

  /**
   * Export the project data as a .project.json file.
   */
  const exportProject = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(data, null, 4)], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = globalConfig.projectId + '.project.json'
    document.body.appendChild(element)
    element.click()
    handleClose()
  }

  const sidebarPanel = useRef('sidebarPanel')
  const cbHandleMouseMove = useCallback(handleMousemove, [])
  const cbHandleMouseUp = useCallback(handleMouseup, [])

  function handleMousedown(e) {
    e.stopPropagation()
    e.preventDefault()

    document.addEventListener('mousemove', cbHandleMouseMove)
    document.addEventListener('mouseup', cbHandleMouseUp)
    isResizing = true
  }

  function handleMousemove(e) {
    if (!isResizing) {
      return
    }

    const rightSide = document.getElementById('wrapper')
    const resizer = document.getElementById('resizer')
    const minWidth = 140

    if (e.clientX > minWidth && e.clientX < drawerMaxSize) {
      sidebarPanel.current.style.width = e.clientX + 'px'
      resizer.style.left = e.clientX + 'px'
      rightSide.style.width = 100 + (drawerMaxSize - e.clientX) + '%'
    }
  }

  function handleMouseup(e) {
    if (!isResizing) {
      return
    }
    isResizing = false
    document.removeEventListener('mousemove', cbHandleMouseMove)
    document.removeEventListener('mouseup', cbHandleMouseUp)
  }

  useEffect(() => {
    if (loaded) return
    setLoaded(true)
    const fetchData = async () => {
      const { data } = await axios.get(
        `${API_ROOT_URL}/projects?projectId=${globalConfig.projectId}`,
        { headers }
      )
      setData(data)
    }
    fetchData()
  }, [])

  return (
    openDrawer && (
      <Box
        sx={{
          display: 'flex',
          overflow: 'hidden',
          flexDirection: 'column',
          width: '190px',
          color: '#d8d6d6',
          position: 'relative',
        }}
        className={styles.container}
      >
        <Drawer
          className={styles.drawer}
          PaperProps={{
            tabIndex: 0,
          }}
          disableEnforceFocus
          classes={{ paper: styles.drawerPaper }}
          anchor="left"
          open={openDrawer}
          tabIndex={0}
          hideBackdrop
          ref={sidebarPanel}
        >
          <Box className={styles.header}>
            <Typography>Project View</Typography>
            <IconButton className={styles.btn} onClick={handleClick}>
              <MoreHoriz />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem>
                <FileInput
                  loadFile={loadFile}
                  sx={{
                    display: 'inline-block',
                    minWidth: '0',
                    padding: 0,
                    margin: 0,
                    color: 'rgba(255,255,255,.5)',
                    backgroundColor: 'rgba(0,0,0,0)',
                    boxShadow: 'none',
                    border: 0,
                  }}
                  Icon={
                    <FileUpload
                      style={{
                        height: '1em',
                        width: '1em',
                        position: 'relative',
                        top: '.25em',
                      }}
                    />
                  }
                  innerText={'Import'}
                />
              </MenuItem>
              <MenuItem>
                <Button
                  variant="contained"
                  style={{
                    padding: '0',
                    color: 'rgba(255,255,255,.5)',
                    backgroundColor: 'rgba(0,0,0,0)',
                    boxShadow: 'none',
                  }}
                  onClick={() => exportProject()}
                >
                  <FileDownload
                    style={{
                      height: '1em',
                      width: '1em',
                    }}
                  />
                  Export
                </Button>
              </MenuItem>
            </Menu>
          </Box>
          <Box
            className={styles.listContainer}
            component="nav"
            aria-label="mailbox folders"
          >
            {data && (
              <TreeView
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ChevronRight />}
                sx={{ flexGrow: 1, width: '100%' }}
              >
                {data?.agents?.length !== 0 && (
                  <TreeItem nodeId="0" label="Agents">
                    {data?.agents?.map((agent, index) => (
                      <TreeItem
                        icon={<Apps />}
                        key={index}
                        style={{ width: '100%' }}
                        nodeId={10 + index.toString()}
                        label={agent.name}
                      />
                    ))}
                  </TreeItem>
                )}
                {data?.spells?.length !== 0 && (
                  <TreeItem nodeId="10" label="Spells">
                    {data.spells?.map((spell, index) => (
                      <TreeItem
                        key={index}
                        icon={<MenuBook />}
                        style={{ width: '100%' }}
                        nodeId={20 + index.toString()}
                        label={spell.name}
                      />
                    ))}
                  </TreeItem>
                )}
                {data?.documents.length !== 0 && (
                  <TreeItem nodeId="20" label="Documents">
                    {data.documents.map((document, index) => (
                      <TreeItem
                        key={index}
                        style={{ width: '100%' }}
                        nodeId={30 + index.toString()}
                        label={document.content.slice(0, 12)}
                        icon={<TextSnippet />}
                      />
                    ))}
                  </TreeItem>
                )}
              </TreeView>
            )}
          </Box>
        </Drawer>
        <div
          id="resizer"
          className={styles.resizer}
          onMouseDown={handleMousedown}
        />
      </Box>
    )
  )
}

export default ProjectWindow

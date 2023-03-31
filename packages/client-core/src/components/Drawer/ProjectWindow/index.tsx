import { API_ROOT_URL, IGNORE_AUTH } from '@magickml/engine'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import { Button, Menu, MenuItem, Typography } from '@mui/material'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FileInput from '../../FileInput/FileInput'
import { FileUpload } from '@mui/icons-material'
import { FileDownload } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { Apps, TextSnippet, MoreHoriz, MenuBook } from '@mui/icons-material/'
import { IconButton } from '@mui/material'

const ProjectWindow = () => {
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [data, setData] = useState({ agents: [], spells: [], documents: [] })
  const [loaded, setLoaded] = useState(false)
  const token = globalConfig?.token
  const headers = IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` }

  /**
   * Load file and upload its contents to the server.
   *
   * @param {File} selectedFile - Selected file object
   */
  const loadFile = selectedFile => {
    if (!token && !IGNORE_AUTH) {
      enqueueSnackbar('You must be logged in to create a project', {
        variant: 'error',
      })
      return
    }
    const fileReader = new FileReader()
    fileReader.readAsText(selectedFile)
    fileReader.onload = event => {
      const data = JSON.parse(event?.target?.result as string)
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
  }

  /**
   * Export the project data as a .project.json file.
   */
  const exportProject = () => {
    console.log('export project')
    // write data to project.json
    // download project.json
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(data)], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = globalConfig.projectId + '.project.json'
    document.body.appendChild(element)
    element.click()
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
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        width: '200px',
        color: '#d8d6d6',
      }}
    >
      <Box
        style={{
          padding: '0.7rem 1rem',
          display: 'flex',
          background: '#272727',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography>Project Name</Typography>
        <IconButton style={{ boxShadow: 'none' }} onClick={handleClick}>
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
      {/* Show Project ID */}
      <Box
        style={{ background: '#424242', height: '100%', paddingTop: '5px' }}
        component="nav"
        aria-label="mailbox folders"
      >
        {/* show tree view of project - Agents, Spells, Documents */}
        {data && (
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
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
                {data.documents.map((document, index) => {
                  return (
                    <TreeItem
                      key={index}
                      style={{ width: '100%' }}
                      nodeId={30 + index.toString()}
                      label={document.content.slice(0, 12)}
                      icon={<TextSnippet />}
                    />
                  )
                })}
              </TreeItem>
            )}
          </TreeView>
        )}
      </Box>
    </Box>
  )
}

export default ProjectWindow

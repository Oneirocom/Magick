import { API_ROOT_URL, IGNORE_AUTH } from '@magickml/engine'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import { Button, Grid } from '@mui/material'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FileInput from '../../components/FileInput'
import { useConfig } from '../../contexts/ConfigProvider'
import { FileUpload } from '@mui/icons-material'
import { FileDownload } from '@mui/icons-material'

const ProjectWindow = ({ tab }) => {
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)

  const [data, setData] = useState({ agents: [], spells: [], documents: [] })
  const [loaded, setLoaded] = useState(false)
  const token = globalConfig?.token

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
        url: `${config.apiUrl}/projects`,
        method: 'POST',
        data: { ...data, projectId: config.projectId },
        headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
      })
        .then(async res => {
          const res2 = await fetch(`${config.apiUrl}/projects?projectId=${config.projectId}`, {
            headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
          })
          const json = await res2.json()
          console.log('json', json)
          setData(json)
        })
        .catch(err => {
          console.error('error is', err)
        })
    }
  }

  const exportProject = () => {
    console.log('export project')
    // write data to project.json
    // download project.json
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(data)], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = config.projectId + '.project.json'
    document.body.appendChild(element)
    element.click()
  }

  useEffect(() => {
    if (loaded) return
    setLoaded(true)
    const fetchData = async () => {
      const { data } = await axios.get(
        `${API_ROOT_URL}/projects?projectId=${config.projectId}`
      )
      setData(data)
    }
    fetchData()
  }, [])

  return (
    <>
      <div
        className="project-container"
        style={{
          width: '100%',
          height: 'calc(100% - 2em)',
          overflow: 'scroll',
        }}
      >
        {/* Show Project ID */}
        <Grid container spacing={2}>
          <Grid item xs={12} style={{width:'100%', height: '1em'}}>
            <span style={{
              position: 'absolute',
              top: '0',
              right: '0',
              zIndex: 10000
              }}>
              <FileInput
                loadFile={loadFile}
                sx={{
                  display: 'inline-block',
                  minWidth: '0',
                  padding: 0,
                  margin: 0,
                  color: 'rgba(255,255,255,.5)',
                  backgroundColor: 'rgba(0,0,0,0)',
                  /* hide drop shadow */
                  boxShadow: 'none',
                  border: 0,
                }}
                Icon={<FileUpload style={{height:'1em', width: '1em', position: 'relative', top: '.25em'}} />}
                innerText={'Import'}
              />
              <Button
                /* hide button, only show inner icon */
                variant="contained"
                style={{
                  minWidth: '0',
                  display: 'inline-block',
                  // align text to the top
                  verticalAlign: 'top',
                  // make sure text is not cut off
                  padding: '0!important',
                  margin: '0!important',
                  color: 'rgba(255,255,255,.5)',
                  backgroundColor: 'rgba(0,0,0,0)',
                  /* hide drop shadow */
                  boxShadow: 'none',
                }}
                onClick={() => exportProject()}
              >
                <FileDownload style={{height:'1em', width: '1em', position: 'relative', top: '.25em'}} />
                Export
              </Button>
            </span>
          </Grid>
          {/* show tree view of project - Agents, Spells, Documents */}
          {data &&
          <Grid item xs={12} style={{ padding: '1em', marginTop: '2em', overflowX: 'hidden' }}>
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ flexGrow: 1, width: '100%' }}
            >
              <TreeItem nodeId="0" label="Agents">
                {data?.agents?.map((agent, index) => (
                  <TreeItem
                    key={index}
                    style={{ width: '100%' }}
                    nodeId={10 + index.toString()}
                    label={agent.name}
                  />
                ))}
              </TreeItem>
              <TreeItem nodeId="10" label="Spells">
                {data.spells.map((spell, index) => (
                  <TreeItem
                    key={index}
                    style={{ width: '100%' }}
                    nodeId={20 + index.toString()}
                    label={spell.name}
                  />
                ))}
              </TreeItem>
              <TreeItem nodeId="20" label="Documents">
                {data.documents.map((document, index) => {
                  return (
                  <TreeItem
                    key={index}
                    style={{ width: '100%' }}
                    nodeId={30 + index.toString()}
                    label={document.content.slice(0, 12)}
                  />
                  )
                }
                )}
              </TreeItem>
            </TreeView>
          </Grid>
          }
          {/* show details of selected item */}
        </Grid>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          height: '2.5em',
          width: '100%',
          margin: 0,
        }}
      >
        <p
          style={{
            margin: '.5em',
            // make small
            fontSize: '0.8em',
            opacity: 0.5,
          }}
        >
          <b>Project ID</b>
          <br />
          {config.projectId}
        </p>
      </div>
    </>
  )
}

export default ProjectWindow

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

const ProjectWindow = ({ tab }) => {
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)

  const [data, setData] = useState({agents: [], spells: [], documents: []})
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
      data: {...data, projectId: config.projectId},
      headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        const res2 = await fetch(`${config.apiUrl}/projects`, {
          headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
        })
        const json = await res2.json()
        setData(json.data)
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
    const file = new Blob([JSON.stringify(data)], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = config.projectId+'.project.json'
    document.body.appendChild(element)
    element.click()
  }

  useEffect(() => {
    if(loaded) return
    setLoaded(true)
    const fetchData = async () => {
      const { data } = await axios.get(
        `${API_ROOT_URL}/projects?projectId=${config.projectId}`
      )
      setData(data)
      console.log('data', data)
    }
    fetchData()
  }, [])

  return (
    <div
      className="project-container"
      style={{
        paddingBottom: '1em',
        width: '100%',
        height: '100vh',
        overflow: 'scroll',
      }}
    >
      {/* Show Project ID */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
        <FileInput loadFile={loadFile} />
          <Button
            variant="contained"
            style={
              {
                float:'right',
                margin: '1em',
                color: 'white',
                backgroundColor: 'purple'
                }
              }
              onClick={() => exportProject()}
            >
              Export
            </Button>
          <p style={{margin: '1em'}}>Project ID: {config.projectId}</p>
        </Grid>
        {/* show tree view of project - Agents, Spells, Documents */}
        <Grid item xs={6} style={{padding:'1em'}}>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, width: '100%' }}
          >
            <TreeItem nodeId="0" label="Agents">
              {data.agents.map((agent, index) => (
                <TreeItem key={index} style={{width:'100%'}} nodeId={10+index.toString()} label={agent.name} />
              ))}
            </TreeItem>
            <TreeItem nodeId="10" label="Spells">
              {data.spells.map((spell, index) => (
                <TreeItem key={index} style={{width:'100%'}} nodeId={20+index.toString()} label={spell.name} />
                ))}
            </TreeItem>
            <TreeItem nodeId="20" label="Documents">
              {data.documents.map((document, index) => (
                <TreeItem key={index} style={{width:'100%'}} nodeId={30+index.toString()} label={document.name} />
              ))}
            </TreeItem>
          </TreeView>
        </Grid>
        {/* show details of selected item */}
        <Grid item xs={6} style={{padding:'1em'}}>
          <h2>Details</h2>
          </Grid>
      </Grid>
    </div>
  )
}

export default ProjectWindow

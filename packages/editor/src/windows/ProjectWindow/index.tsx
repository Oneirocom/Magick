import { API_ROOT_URL } from '@magickml/engine'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import { Button, Grid } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'

const ProjectWindow = () => {
  const config = useConfig()

  const [data, setData] = useState({agents: [], spells: [], documents: []})
  const [loaded, setLoaded] = useState(false)
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
          <Button variant="contained" style={{float:'right', margin: '1em', color: 'white', backgroundColor: 'purple'}}>Import</Button>
          <Button variant="contained" style={{float:'right', margin: '1em', color: 'white', backgroundColor: 'purple'}}>Export</Button>
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

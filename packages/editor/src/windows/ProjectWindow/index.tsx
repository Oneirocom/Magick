import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import { Button, Grid } from '@mui/material'
import { useConfig } from '../../contexts/ConfigProvider'

const ProjectWindow = () => {
  const config = useConfig()

  const agents = []
  const spells = []
  const documents = []

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
          <h1 style={{margin: '1em'}}>Project ID: {config.projectId}</h1>
        </Grid>
        {/* show tree view of project - Agents, Spells, Documents */}
        <Grid item xs={6} style={{padding:'1em'}}>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem nodeId="1" label="Agents">
              {agents.map((agent, index) => (
                <TreeItem nodeId={index} label={agent.name} />
              ))}
            </TreeItem>
            <TreeItem nodeId="2" label="Spells">
              {spells.map((spell, index) => (
                <TreeItem nodeId={index} label={spell.name} />
              ))}
            </TreeItem>
            <TreeItem nodeId="3" label="Documents">
              {documents.map((document, index) => (
                <TreeItem nodeId={index} label={document.name} />
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

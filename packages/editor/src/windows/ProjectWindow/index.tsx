// GENERATED 
import { API_ROOT_URL, IGNORE_AUTH } from '@magickml/engine';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import { Button, Grid } from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FileInput from '../../components/FileInput';
import { useConfig } from '../../contexts/ConfigProvider';
import { FileUpload } from '@mui/icons-material';
import { FileDownload } from '@mui/icons-material';

/**
 * ProjectWindow component displays project details in a tree structure.
 * Allows importing and exporting the project.
 *
 * @param {object} props - Component properties
 * @param {string} props.tab - Tab name
 * @returns {JSX.Element}
 */
const ProjectWindow = ({ tab }) => {
  const config = useConfig();
  const globalConfig = useSelector((state: any) => state.globalConfig);

  const [data, setData] = useState({ agents: [], spells: [], documents: [] });
  const [loaded, setLoaded] = useState(false);
  const token = globalConfig?.token;
  const headers = IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` };

  /**
   * Load file and upload its contents to the server.
   *
   * @param {File} selectedFile - Selected file object
   */
  const loadFile = (selectedFile) => {
    if (!token && !IGNORE_AUTH) {
      enqueueSnackbar('You must be logged in to create a project', {
        variant: 'error',
      });
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile);
    fileReader.onload = (event) => {
      const data = JSON.parse(event?.target?.result as string);
      delete data['id'];
      axios({
        url: `${config.apiUrl}/projects`,
        method: 'POST',
        data: { ...data, projectId: config.projectId },
        headers,
      })
        .then(async (res) => {
          const res2 = await fetch(
            `${config.apiUrl}/projects?projectId=${config.projectId}`,
            { headers }
          );
          const json = await res2.json();
          console.log('json', json);
          setData(json);
        })
        .catch((err) => {
          console.error('error is', err);
        });
    };
  };

  /**
   * Export the project data as a .project.json file.
   */
  const exportProject = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = config.projectId + '.project.json';
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    const fetchData = async () => {
      const { data } = await axios.get(
        `${API_ROOT_URL}/projects?projectId=${config.projectId}`,
        { headers }
      );
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div
      className="project-container"
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ width: '100%', height: '1em' }}>
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              zIndex: 10000,
            }}
          >
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
            <Button
              variant="contained"
              style={{
                minWidth: '0',
                display: 'inline-block',
                verticalAlign: 'top',
                padding: '0!important',
                margin: '0!important',
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
                  position: 'relative',
                  top: '.25em',
                }}
              />
              Export
            </Button>
          </span>
        </Grid>
        {data && (
          <Grid
            item
            xs={12}
            style={{ padding: '1em', marginTop: '2em', overflowX: 'hidden' }}
          >
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
                {data.documents.map((document, index) => (
                  <TreeItem
                    key={index}
                    style={{ width: '100%' }}
                    nodeId={30 + index.toString()}
                    label={document.content.slice(0, 12)}
                  />
                ))}
              </TreeItem>
            </TreeView>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ProjectWindow;

// GENERATED 
import { Button, Grid, Typography } from '@mui/material';
import AgentItem from './AgentItem';
import styles from './index.module.scss';
import AgentDetails from './AgentDetails';
import FileInput from '../../../components/FileInput';
import { useEffect, useState } from 'react';
import { useConfig } from '../../../contexts/ConfigProvider';

/**
 * Props for AgentWindow component
 */
interface Props {
  data: Array<object>;
  selectedAgentData: object;
  onLoadEnables: object;
  setRootSpell: (spell: string) => void;
  setSelectedAgentData: (data: object) => void;
  onCreateAgent: (data: any) => void;
  updateCallBack: () => void;
  update: (id: string, data: object) => void;
  onDelete: (id: string) => void;
  onLoadFile: (selectedFile: any) => void;
}

/**
 * AgentWindow component
 * @param data - array of agents data
 * @param selectedAgentData - currently selected agent data
 * @param onLoadEnables - callback for enabling agents load
 * @param setRootSpell - callback for setting root spell
 * @param setSelectedAgentData - callback for setting selected agent data
 * @param onCreateAgent - callback for creating an agent
 * @param updateCallBack - callback after updating an agent
 * @param update - function to update an agent
 * @param onDelete - function to delete an agent
 * @param onLoadFile - function to load agents from a file
 * @returns AgentWindow component
 */
const AgentWindow = ({
  data,
  selectedAgentData,
  updateCallBack,
  onCreateAgent,
  setSelectedAgentData,
  onDelete,
  onLoadFile,
  onLoadEnables,
}: Props) => {
  const config = useConfig();

  /**
   * Handler for agent click
   * @param agent - clicked agent
   */
  const onClickHandler = (agent) => {
    setSelectedAgentData(agent);
  };

  // Set selected agent data to first item if not yet set
  useEffect(() => {
    if (!selectedAgentData) {
      setSelectedAgentData(data[0] as any);
    }
  }, [data, selectedAgentData, setSelectedAgentData]);

  return (
    <Grid container className={styles.container}>
      <Grid item xs={3.9} className={styles.item}>
        <div className={styles.btnContainer}>
          <Typography variant="h6" className={`${styles.heading}`}>
            Agents
          </Typography>
          <FileInput loadFile={onLoadFile} />
        </div>

        <Button
          variant="contained"
          className={`${styles.btn} ${styles['mg-btm-medium']}`}
          onClick={() =>
            onCreateAgent({
              name: 'New Agent',
              projectId: config.projectId,
              enabled: false,
              spells: '[]',
              rootSpell: {},
              publicVariables: '{}',
              secrets: '{}',
            })
          }
        >
          Add Agent
        </Button>
        {data?.map((agent: { id: string }) => {
          return (
            <AgentItem
              key={agent?.id}
              keyId={agent?.id}
              onDelete={onDelete}
              onClick={onClickHandler}
              agent={agent}
              style={
                agent?.id === selectedAgentData?.id
                  ? { border: '1px solid var(--primary)' }
                  : {}
              }
            />
          );
        })}
      </Grid>
      <Grid item xs={8} className={styles.item}>
        {selectedAgentData ? (
          <AgentDetails
            selectedAgentData={selectedAgentData}
            setSelectedAgentData={setSelectedAgentData}
            updateCallback={updateCallBack}
            onLoadEnables={onLoadEnables}
          />
        ) : (
          <Typography className={styles.noSelected}>Select Agent</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default AgentWindow;
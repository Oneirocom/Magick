// GENERATED 
import { Button, Grid, Typography } from '@mui/material';
import AgentItem from './AgentItem';
import styles from './index.module.scss';
import AgentDetails from './AgentDetails';
import FileInput from '../../../components/FileInput';
import { useEffect } from 'react';
import { useConfig } from '../../../contexts/ConfigProvider';

/**
 * Interface for agent window properties.
 */
interface Props {
  data: Array<object>;
  selectedAgentData: object;
  rootSpell: object;
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
 * Agent window component.
 *
 * @param {Props} {
 *   data,
 *   selectedAgentData,
 *   updateCallBack,
 *   onCreateAgent,
 *   setSelectedAgentData,
 *   onDelete,
 *   onLoadFile,
 *   onLoadEnables,
 * }
 * @returns Component
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
  // Config context
  const config = useConfig();

  /**
   * Agent click handler.
   *
   * @param {object} agent - The agent to set as selected.
   */
  const onClickHandler = (agent: object) => {
    setSelectedAgentData(agent);
  };

  // Effect to set selected agent data
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

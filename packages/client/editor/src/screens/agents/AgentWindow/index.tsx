// DOCUMENTED
import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { Button, Grid, Typography } from '@mui/material'
import AgentItem from './AgentItem'
import styles from './index.module.scss'
import AgentDetails from './AgentDetails'
import FileInput from '../../../components/FileInput/FileInput'
import { useConfig } from '@magickml/providers'
import { useCreateAgentMutation } from 'client/state'

/**
 * Props for AgentWindow component
 */
interface Props {
  data: Array<object>
  onLoadFile: (selectedFile: any) => void
}

/**
 * AgentWindow component
 * @param data - array of agents data
 * @param onLoadEnables - callback for enabling agents load
 * @param onDelete - function to delete an agent
 * @param onLoadFile - function to load agents from a file
 * @returns AgentWindow component
 */
const AgentWindow = ({
  data,
  onLoadFile,
}: Props) => {
  const config = useConfig()
  const [createNewAgent] = useCreateAgentMutation()
  const [selectedAgentData, setSelectedAgentData] = useState<any>(undefined)
  /**
   * Handler for agent click
   * @param agent - clicked agent
   */
  const onClickHandler = agent => {
    setSelectedAgentData(agent)
  }

  // Set selected agent data to first item if not yet set
  useEffect(() => {
    if (!selectedAgentData) {
      setSelectedAgentData(data[0] as any)
    }
  }, [data, selectedAgentData, setSelectedAgentData])

  return (
    <div className={styles.wrapper}>
      <Grid container className={styles.container}>
        <Grid item md={3.9} xs={12} sm={12} className={styles.item}>
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
              createNewAgent({
                name: 'New Agent',
                projectId: config.projectId,
                enabled: false,
                publicVariables: '{}',
                secrets: '{}',
              })
                .unwrap()
                .then(() => {
                  enqueueSnackbar('Agent created successfully!', {
                    variant: 'success',
                  })
                })
                .catch(() => {
                  enqueueSnackbar('Error creating agent!', { variant: 'error' })
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
                onClick={onClickHandler}
                agent={agent}
                style={
                  agent?.id === selectedAgentData?.id
                    ? { border: '1px solid var(--primary)' }
                    : {}
                }
              />
            )
          })}
        </Grid>
        <Grid item md={8} xs={12} sm={12} className={styles.item}>
          {selectedAgentData ? (
            <AgentDetails
              selectedAgentData={selectedAgentData}
              setSelectedAgentData={setSelectedAgentData}
            />
          ) : (
            <Typography className={styles.noSelected}>Select Agent</Typography>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default AgentWindow

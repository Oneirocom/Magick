import { Button, Grid, Typography } from '@mui/material'
import AgentItem from './AgentItem'
import styles from './index.module.scss'
import AgentDetails from './AgentDetails'
import FileInput from '../../../screens/HomeScreen/components/FileInput'
import { useState } from 'react'

interface Props {
  data: Array<Object>
  onCreateAgent: () => void
  updateCallBack: () => void
  update: (data: any) => void
  onDelete: (id: string) => void
  onLoadFile: (selectedFile: any) => void
}

const AgentWindow = ({
  data,
  update,
  updateCallBack,
  onCreateAgent,
  onDelete,
  onLoadFile,
}: Props) => {
  const [selectedAgent, setSelectedAgent] = useState('')

  const onClickHandler = agent => {
    setSelectedAgent(agent)
  }

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
          onClick={() => onCreateAgent()}
        >
          Add Agent
        </Button>
        {data.map(agent => (
          <AgentItem
            key={agent?.id}
            keyId={agent?.id}
            onDelete={onDelete}
            setSelectedAgent={setSelectedAgent}
            onClick={onClickHandler}
            agent={agent}
            style={
              agent?.id === selectedAgent?.id
                ? { border: '1px solid var(--primary)' }
                : {}
            }
          />
        ))}
      </Grid>
      <Grid item xs={8} className={styles.item}>
        {selectedAgent ? (
          <AgentDetails
              agentData={selectedAgent}
              setSelectedAgent={setSelectedAgent}
              updateCallback={updateCallBack}
            />
        ) : (
          <Typography className={styles.noSelected}>Select Agent</Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default AgentWindow

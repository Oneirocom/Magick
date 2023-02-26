import { Button, Grid, Typography } from '@mui/material'
import AgentItem from './AgentItem'
import styles from './index.module.scss'
import AgentDetails from './AgentDetails'
import AgentPubVariables from './AgentPubVariables'
import Accordion from '../../../components/Accordion'
import { useState } from 'react'

interface Props {
  data: Array<Object>
  selectedSpellVars: any
  onCreateAgent: () => void
  update: (data: any) => void
  onDelete: (id: number) => void
  children: React.ReactNode
}

const AgentWindow = ({
  data,
  selectedSpellVars,
  update,
  onCreateAgent,
  onDelete,
}: Props) => {
  const [selectedAgent, setSelectedAgent] = useState('')

  const onClickHandler = agent => {
    setSelectedAgent(agent)
  }
  return (
    <Grid container className={styles.container}>
      <Grid item xs={3.9} className={styles.item}>
        <Typography
          variant="h6"
          className={`${styles.heading} ${styles['mg-btm-small']}`}
        >
          Agents
        </Typography>
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
            onDelete={onDelete}
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
          <>
            <AgentDetails agentData={selectedAgent} />
          </>
        ) : (
          <Typography className={styles.noSelected}>Select Agent</Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default AgentWindow

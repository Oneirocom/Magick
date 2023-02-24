import IconBtn from 'packages/editor/src/components/IconButton'
import Icon from 'packages/editor/src/components/Icon/Icon'
import {} from '@mui/icons-material'
import { Avatar, Typography } from '@mui/material'
import styles from './index.module.scss'
import SwitchComponent from 'packages/editor/src/components/Switch/Switch'

const AgentDetails = () => {
  return (
    <div
      className={`${styles.agentDetailsContainer} ${styles['mg-btm-medium']}`}
    >
      <div className={styles.agentDescription}>
        <Avatar className={styles.avatar}>A</Avatar>
        <div>
          <Typography variant="h6">Albert Eistein</Typography>
          <p style={{ margin: '0' }}>
            This is the description of my awesome agent so I can reference it in
            other places.
          </p>
        </div>
      </div>
      <SwitchComponent
        label={'Active'}
        checked
        onChange={() => {}}
        style={{ alignSelf: 'self-start' }}
      />
    </div>
  )
}

export default AgentDetails

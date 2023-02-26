import { Icon, IconBtn } from '@magickml/client-core'
import { Avatar, Typography } from '@mui/material'
import styles from './index.module.scss'

const AgentItem = ({ agent, onDelete, onClick, style }) => {
  return (
    <div
      className={styles.agentItemContainer}
      onClick={() => onClick(agent)}
      style={style}
    >
      <div className={styles.agentItem}>
        <Avatar className={styles.roundedDiv}>
          {agent?.name?.at(0) || 'A'}
        </Avatar>
        <Typography variant="h6">{agent?.name || 'Albert'}</Typography>
      </div>
      <IconBtn
        label={'delete'}
        Icon={<Icon name="trash" size={20} style={{ color: 'black' }} />}
        onClick={() => onDelete(agent?.id)}
      />{' '}
    </div>
  )
}

export default AgentItem

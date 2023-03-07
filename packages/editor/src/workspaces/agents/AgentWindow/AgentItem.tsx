import { useState } from 'react'
import { Icon, IconBtn } from '@magickml/client-core'
import { Avatar, Typography } from '@mui/material'
import { Edit, Done, Close } from '@mui/icons-material'
import styles from './index.module.scss'

const AgentItem = ({ keyId, agent, onDelete, onClick, style }) => {
  return (
    <div
      key={keyId}
      className={styles.agentItemContainer}
      onClick={() => onClick(agent)}
      style={style}
    >
      <div className={styles.agentItem}>
        <Avatar className={styles.roundedDiv}>
          {agent?.name?.at(0) || 'A'}
        </Avatar>
        <Typography variant="h6">{agent?.name}</Typography>
      </div>
      <div>
        <IconBtn
          label={'delete'}
          Icon={<Icon name="trash" size={20} />}
          onClick={e => {
            e.stopPropagation()
            onDelete(agent?.id)
          }}
        />
      </div>
    </div>
  )
}

export default AgentItem

import { useState } from 'react'
import { Icon, IconBtn } from '@magickml/client-core'
import { Avatar, Typography } from '@mui/material'
import { Edit, Done, Close } from '@mui/icons-material'
import styles from './index.module.scss'

const AgentItem = ({
  keyId,
  agent,
  setSelectedAgent,
  update,
  onDelete,
  onClick,
  style,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [name, setName] = useState<string>(agent?.name || '')

  return (
    <div
      key={keyId}
      className={styles.agentItemContainer}
      onClick={() => onClick(agent)}
      style={style}
    >
      {editMode ? (
        <>
          <div>
            <input
              type="text"
              name="name"
              value={name}
              onClick={e => e.stopPropagation()}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <IconBtn
              label={'Done'}
              Icon={<Done />}
              onClick={e => {
                e.stopPropagation()
                update(agent.id, { name })
                setEditMode(true)
              }}
            />
            <IconBtn
              label={'close'}
              Icon={<Close />}
              onClick={e => {
                e.stopPropagation()
                setEditMode(false)
                setName(agent.name)
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className={styles.agentItem}>
            <Avatar className={styles.roundedDiv}>
              {agent?.name?.at(0) || 'A'}
            </Avatar>
            <Typography variant="h6">{agent?.name}</Typography>
          </div>
          <div>
            <IconBtn
              label={'edit'}
              Icon={<Edit />}
              onClick={e => {
                e.stopPropagation()
                setEditMode(true)
              }}
            />
            <IconBtn
              label={'delete'}
              Icon={<Icon name="trash" size={20} />}
              onClick={e => {
                e.stopPropagation()
                onDelete(agent?.id)
                setSelectedAgent('')
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default AgentItem

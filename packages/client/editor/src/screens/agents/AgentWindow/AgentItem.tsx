import { Icon, IconBtn } from 'client/core'
import { Avatar, Typography } from '@mui/material'
import { Modal } from 'client/core'
import styles from './index.module.scss'
import { useState } from 'react'

const AgentItem = ({ keyId, agent, onDelete, onClick, style }) => {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [agentId, setAgentID] = useState<string>('')

  const handleClose = () => {
    setOpenConfirm(false)
    setAgentID('')
  }

  const onSubmit = () => {
    onDelete(agentId)
    setAgentID('')
    setOpenConfirm(false)
  }

  // Conditionally render the delete button only if the agent's name is not "Default Agent"
  const renderDeleteButton = () => {
    if (!agent.default) {
      return (
        <IconBtn
          label={'delete'}
          Icon={<Icon name="trash" size={20} />}
          onClick={e => {
            e.stopPropagation()
            setAgentID(agent.id)
            setOpenConfirm(true)
          }}
        />
      )
    } else {
      return null // Return null to effectively disable the delete button
    }
  }

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
      <div>{renderDeleteButton()}</div>
      <Modal
        open={openConfirm}
        onClose={handleClose}
        handleAction={onSubmit}
        title={`Delete ${agent?.name} agent`}
        submitText="Confirm"
        children="Do you want to delete this agent?"
      />
    </div>
  )
}

export default AgentItem

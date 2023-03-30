// GENERATED 
/**
 * A component to display an agent item.
 * @module AgentItem
 * @param {Object} props - The component props.
 * @param {String} props.keyId - The key id of the agent item.
 * @param {Object} props.agent - The agent object to display.
 * @param {Function} props.onDelete - The function to call when delete button is clicked.
 * @param {Function} props.onClick - The function to call when the item is clicked.
 * @param {Object} props.style - The style object to apply to the container.
 */
import { Icon, IconBtn } from '@magickml/client-core'
import { Avatar, Typography } from '@mui/material'
import styles from './index.module.scss'

const AgentItem = ({ keyId, agent, onDelete, onClick, style }) => {

  /**
   * Handles delete button click.
   * @function
   * @param {Object} event - The click event.
   */
  const handleDeleteClick = (event) => {
    event.stopPropagation()
    onDelete(agent?.id)
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
      <div>
        <IconBtn
          label={'delete'}
          Icon={<Icon name="trash" size={20} />}
          onClick={handleDeleteClick}
        />
      </div>
    </div>
  )
}

export default AgentItem
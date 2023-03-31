// GENERATED
import { Icon, IconBtn } from '@magickml/client-core'
import { Avatar, Typography } from '@mui/material'
import styles from './index.module.scss'

/**
 * Represents an agent item component.
 * @param {Object} props - The properties for this component.
 * @param {string} props.keyId - The unique key for this agent item.
 * @param {Object} props.agent - The agent object.
 * @param {Function} props.onDelete - The function to be called when the delete button is clicked.
 * @param {Function} props.onClick - The function to be called when the agent item is clicked.
 * @param {Object} [props.style] - Inline CSS styles if needed.
 * @returns {React.Element} The rendered agent item component.
 */
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

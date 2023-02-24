import IconBtn from 'packages/editor/src/components/IconButton'
import Icon from 'packages/editor/src/components/Icon/Icon'
import {} from '@mui/icons-material'
import { Avatar, Typography } from '@mui/material'
import styles from './index.module.scss'

const AgentItem = () => {
  return (
    <div className={styles.agentItemContainer}>
      <div className={styles.agentItem}>
        <Avatar className={styles.roundedDiv}>A</Avatar>
        <Typography variant="h6">Albert Eistein</Typography>
      </div>
      <IconBtn
        label={'delete'}
        Icon={<Icon name="trash" size={20} style={{ color: 'black' }} />}
        onClick={() => {}}
      />{' '}
    </div>
  )
}

export default AgentItem

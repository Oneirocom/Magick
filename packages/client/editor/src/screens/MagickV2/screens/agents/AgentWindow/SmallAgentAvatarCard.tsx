import { IconBtn } from 'client/core'
import Avatar from "@mui/material/Avatar"
import styles from './index.module.scss'
import Typography from "@mui/material/Typography"
import { Edit } from '@mui/icons-material'

export const SmallAgentAvatarCard = ({
  agent,
  setEditMode,
  setOldName
}) => {
  return (
    <>
      <Avatar className={styles.avatar}>
        {agent?.name?.slice(0, 1)[0]}{' '}
      </Avatar>
      <div>
        <Typography variant="h5">{agent.name}</Typography>
      </div>
      <IconBtn
        label={'edit'}
        Icon={<Edit />}
        onClick={e => {
          setEditMode(true)
          setOldName(agent.name)
        }}
      />
    </>
  )
}
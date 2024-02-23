import React from 'react'
import { MenuItem, ListItemText, Box, Checkbox } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { AgentInterface } from 'server/schemas'
import { Avatar, AvatarImage } from '@magickml/client-ui'
import clsx from 'clsx'

const AgentListItem = ({
  agent,
  onSelectAgent,
  isDraft = false,
  selectedAgents,
  onCheckboxChange,
  isSinglePublishedAgent = false,
}: {
  agent: AgentInterface
  onSelectAgent: (agent: AgentInterface) => void
  isDraft?: boolean
  selectedAgents?: string[]
  onCheckboxChange?: (agentId: string, checked: boolean) => void
  isSinglePublishedAgent?: boolean
}) => {
  const agentImage = agent.image
    ? `${process.env.NEXT_PUBLIC_BUCKET_PREFIX}${agent.image}`
    : undefined

  const formatDate = (date: string) => {
    if (!date) return ''
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  const handleCheckboxClick = event => {
    if (event.target.type === 'checkbox') {
      event.stopPropagation()
    }
  }

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (onCheckboxChange) {
      onCheckboxChange(agent.id, checked)
    }
  }

  return (
    <MenuItem
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
      onClick={() => {
        onSelectAgent(agent)
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={handleCheckboxClick}
      >
        {!isDraft && !isSinglePublishedAgent && (
          <Checkbox
            size="small"
            checked={selectedAgents?.includes(agent.id)}
            onChange={handleCheckboxChange}
            sx={{
              marginRight: '8px',
              padding: 0,
            }}
          />
        )}
        <Avatar
          className={clsx('self-center border border-ds-primary w-8 h-8')}
        >
          <AvatarImage
            className="object-cover w-full h-full rounded-full"
            src={`${agentImage}`}
            alt={agent.name.at(0) || 'Agent'}
          />
          {agent.name.at(0) || 'A'}
        </Avatar>
        <ListItemText
          primary={agent.name}
          secondary={`Updated ${formatDate(
            (agent.updatedAt as string) || (agent.createdAt as string)
          )}`}
          sx={{
            ml: 1,
            maxWidth: isDraft ? '220px' : '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        />
      </Box>

      {!isDraft && (
        <Box sx={{ marginRight: '4px' }}>
          <LockIcon />
        </Box>
      )}
    </MenuItem>
  )
}

export default AgentListItem

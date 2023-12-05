import React from 'react';
import { MenuItem, Avatar, ListItemText, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { AgentInterface } from 'server/core';

const AgentListItem = ({
  agent,
  onSelectAgent,
  isDraft = false
}: {
  agent: AgentInterface
  onSelectAgent: (agent: AgentInterface) => void
  isDraft?: boolean
}) => {
  const agentImage = agent.image
    ? `https://pub-58d22deb43dc48e792b7b7468610b5f9.r2.dev/magick-dev/agents/${agent.image}`
    : undefined;


  const formatDate = (date: string) => {
    if (!date) return false
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  return (
    <MenuItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} onClick={() => onSelectAgent(agent)}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={agent.name.at(0) || 'A'}
          src={agentImage}
          sx={{ width: 24, height: 24 }}
        >
          {agent.name.at(0) || 'A'}
        </Avatar>
        <ListItemText
          primary={agent.name}
          secondary={`${agent.updatedAt ? 'Updated:' : 'Created:'} ${formatDate(agent.updatedAt || agent.createdAt)}`}
          sx={{
            ml: 1,
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }} />
      </Box>
      {!isDraft && <LockIcon />}
    </MenuItem>
  );
};

export default AgentListItem;

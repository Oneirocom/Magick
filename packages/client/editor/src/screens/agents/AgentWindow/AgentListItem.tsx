import React from 'react';
import { MenuItem, Avatar, ListItemText, Box, Checkbox } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { AgentInterface } from 'server/core'; // Adjust the import path as necessary

const AgentListItem = ({
  agent,
  onSelectAgent,
  isDraft = false,
  selectedAgents,
  onCheckboxChange,
}: {
  agent: AgentInterface;
  onSelectAgent?: (agent: AgentInterface) => void;
  onAddSelectedAgent?: (agent: string) => void;
  onRemoveSelectedAgent?: (agent: string) => void;
  isDraft?: boolean;
  selectedAgents?: string[];
  onCheckboxChange?: (agentId: string, checked: boolean) => void;
}) => {
  const agentImage = agent.image
    ? `https://pub-58d22deb43dc48e792b7b7468610b5f9.r2.dev/magick-dev/agents/${agent.image}`
    : undefined;

  const formatDate = (date: string) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent menu close
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (onCheckboxChange) {
      onCheckboxChange(agent.id, checked);
    }
  };

  return (
    <MenuItem
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
      onClick={() => onSelectAgent && onSelectAgent(agent)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleCheckboxClick}>
        {!isDraft && (
          <Checkbox
            size='small'
            checked={selectedAgents?.includes(agent.id)}
            onChange={handleCheckboxChange}
            sx={{
              ":hover": {
                backgroundColor: 'transparent',
                cursor: 'pointer',
              },
              marginRight: 0,
              marginLeft: 0,
              paddingLeft: 0,
            }}
          />
        )}
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
            maxWidth: isDraft ? '220px' : '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }} />
      </Box>

      {!isDraft && (
        <Box sx={{ marginRight: '4px' }}>
          <LockIcon />
        </Box>
      )}
    </MenuItem>
  );
};

export default AgentListItem;

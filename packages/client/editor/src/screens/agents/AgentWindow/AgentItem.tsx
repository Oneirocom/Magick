import React, { useState } from 'react';
import { Avatar, Typography } from '@mui/material';
import { Icon, IconBtn, Modal } from 'client/core';
import styles from './index.module.scss';
import { enqueueSnackbar } from 'notistack';
import { useDeleteAgentMutation } from 'client/state';

const AgentItem = ({ keyId, agent, onClick, style }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteAgent] = useDeleteAgentMutation();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenConfirm(true);
  };

  const handleClose = () => {
    setOpenConfirm(false);
  };

  const onSubmit = async () => {
    if (agent.id) {
      try {
        await deleteAgent({ agentId: agent.id }).unwrap();
        enqueueSnackbar('Agent deleted successfully!', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting agent:', error);
        enqueueSnackbar('Error deleting agent!', { variant: 'error' });
      } finally {
        setOpenConfirm(false);
      }
    }
  };

  const renderDeleteButton = () => {
    return !agent.default ? (
      <IconBtn
        label="delete"
        Icon={<Icon name="trash" size={20} />}
        onClick={handleDeleteClick}
      />
    ) : null;
  };

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
        title={`Delete Agent: ${agent?.name}`}
        submitText="Confirm"
        children="Do you want to delete this agent?"
      />
    </div>
  );
};

export default AgentItem;

// GENERATED 
import { Modal, Switch } from '@magickml/client-core';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';

/**
 * The VariableModal component displays a modal form for editing Twitter bot settings.
 * @param selectedAgentData - The agent data to display in the modal.
 * @param editMode - The display mode for the modal.
 * @param setEditMode - Sets the display mode for the modal.
 * @param update - The updates function.
 */
const VariableModal = ({
  selectedAgentData,
  editMode,
  setEditMode,
  update,
}) => {
  // Initialize form state with agent data
  const [state, setState] = useState({
    twitter_userid: selectedAgentData?.data?.twitter_userid,
    twitter_bearer_token: selectedAgentData?.data?.twitter_bearer_token,
    twitter_api_key: selectedAgentData?.data?.twitter_api_key,
    twitter_api_key_secret: selectedAgentData?.data?.twitter_api_key_secret,
    twitter_access_token: selectedAgentData?.data?.twitter_access_token,
    twitter_access_token_secret:
      selectedAgentData?.data?.twitter_access_token_secret,
    twitter_stream_rules: selectedAgentData?.data?.twitter_stream_rules,
    twitter_feed_enable: selectedAgentData?.data?.twitter_feed_enable,
  });

  /**
   * Update state on form changes
   * @param e - The event object.
   */
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === 'twitter_feed_enable') {
      setState({ ...state, [name]: e.target.checked ? 'on' : 'off' });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  /**
   * Save edited form data and update the agent
   */
  const handleSave = () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ...state,
      },
    };

    update(selectedAgentData.id, data);
  };

  return (
    <Modal open={editMode} setOpen={setEditMode} handleAction={handleSave}>
      ...
    </Modal>
  );
};

export default VariableModal;
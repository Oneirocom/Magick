// DOCUMENTED 
import React, { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { debounce } from 'lodash';
import { Switch } from '@magickml/client-core';
import Button from '@mui/material/Button';
import VariableModal from './VariableModal';

/**
 * TwitterAgentWindow component
 */
export const TwitterAgentWindow: FC<any> = (props) => {
  // Destructure properties from props.props
  props = props.props;
  const { selectedAgentData, setSelectedAgentData, update } = props;

  /**
   * Debounced function to update agent data with a delay of 500ms
   */
  const debouncedFunction = debounce((id, data) => update(id, data), 500);

  // State variables
  const [editMode, setEditMode] = useState<boolean>(false);
  const [checked, setChecked] = useState(selectedAgentData.data?.twitter_enabled);
  const [disable, setDisable] = useState(false);

  // Effect to handle enabling/disabling of the Twitter plugin
  useEffect(() => {
    if (props.enable["TwitterPlugin"] === false) {
      setChecked(false);
      setDisable(true);
    }
    if (props.enable['TwitterPlugin'] === true) {
      setChecked(selectedAgentData.data?.twitter_enabled);
      setDisable(false);
    }
  }, [props.enable, selectedAgentData]);

  return (
    <>
      <div
        style={{
          backgroundColor: '#222',
          padding: '2em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: disable ? 'none' : 'auto',
          opacity: disable ? 0.2 : 1,
        }}
      >
        <h3>Twitter</h3>
        <div
          style={{
            display: 'flex',
            paddingTop: '1em',
          }}
        >
          <button
            onClick={() => {
              setEditMode(true);
            }}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          >
            Edit
          </button>
          <Switch
            label={null}
            checked={checked}
            onChange={(e) => {
              setChecked(!checked);

              debouncedFunction(selectedAgentData.id, {
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  twitter_enabled: e.target.checked,
                },
              });

              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  twitter_enabled: e.target.checked,
                },
              });
            }}
            style={{ float: 'right' }}
          />
        </div>
      </div>
      {editMode && (
        <VariableModal
          editMode={editMode}
          setEditMode={setEditMode}
          selectedAgentData={selectedAgentData}
          update={update}
        />
      )}
    </>
  );
};
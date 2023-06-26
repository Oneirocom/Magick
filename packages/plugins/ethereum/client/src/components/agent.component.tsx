// DOCUMENTED
import React, { FC, useEffect, useState } from 'react';
import { Switch } from '@magickml/client-core';
import VariableModal from './VariableModal'
import { debounce } from 'lodash';

/**
 * PluginProps type
 */
type PluginProps = {
  selectedAgentData: any;
  props: {
    selectedAgentData: any;
    setSelectedAgentData: any;
    enable: boolean;
    update: (id: string, data: object) => void;
  };
};

/**
 * EthereumAgentWindow component.
 * Displays an Ethereum agent settings section with an edit mode.
 * @param props - PluginProps with selected agent data and additional props
 */
export const EthereumAgentWindow: FC<PluginProps> = props => {
  const { selectedAgentData, setSelectedAgentData, update, enable } = props.props

  // Initialize the state variables
  const debouncedFunction = debounce((id, data) => update(id, data), 500);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [checked, setChecked] = useState(
    selectedAgentData.data?.ethereum_enabled || false
  );
  const [disable, setDisable] = useState(false);

  const handleClose = () => {
    setEditMode(false)
  }

  // Handle enable/disable of the loop plugin
  useEffect(() => {
    if (enable['EthereumPlugin'] === false) {
      setChecked(false);
      setDisable(true);
    } else if (enable['EthereumPlugin'] === true) {
      setChecked(selectedAgentData.data?.ethereum_enabled);
      setDisable(false);
    }
  }, [enable, selectedAgentData]);

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
        <h3>Ethereum</h3>
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
                  ethereum_enabled: e.target.checked,
                },
              });

              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  ethereum_enabled: e.target.checked,
                },
              });
            }}
            style={{ float: 'right' }}
          />
        </div>
      </div>

      {editMode && (
        <VariableModal
          selectedAgentData={selectedAgentData}
          editMode={editMode}
          setEditMode={handleClose}
          update={update}
        />
      )}
    </>
  );
};

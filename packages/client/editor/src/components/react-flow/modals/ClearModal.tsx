import React from 'react';
import { useReactFlow } from 'reactflow';

import { Modal } from './Modal.js';

export type ClearModalProps = {
  open?: boolean;
  onClose: () => void;
};

export const ClearModal: React.FC<ClearModalProps> = ({
  open = false,
  onClose
}) => {
  const instance = useReactFlow();

  const handleClear = () => {
    instance.setNodes([]);
    instance.setEdges([]);
    // TODO better way to call fit vew after edges render
    setTimeout(() => {
      instance.fitView();
    }, 100);
    onClose();
  };

  return (
    <Modal
      title="Clear Graph"
      actions={[
        { label: 'Cancel', onClick: onClose },
        { label: 'Clear', onClick: handleClear }
      ]}
      open={open}
      onClose={onClose}
    >
      <p>Are you sure?</p>
    </Modal>
  );
};

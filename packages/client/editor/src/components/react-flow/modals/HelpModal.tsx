import React from 'react';

import { Modal } from './Modal.js';

export type HelpModalProps = {
  open?: boolean;
  onClose: () => void;
};

export const HelpModal: React.FC<HelpModalProps> = ({
  open = false,
  onClose
}) => {
  return (
    <Modal
      title="Help"
      actions={[{ label: 'Close', onClick: onClose }]}
      open={open}
      onClose={onClose}
    >
      <p className="mb-2">Right click anywhere to add a new node.</p>
      <p className="mb-2">
        Drag a connection into empty space to add a new node and connect it to
        the source.
      </p>
      <p className="mb-2">
        Click and drag on a socket to connect to another socket of the same
        type.
      </p>
      <p>
        Left click to select nodes or connections, backspace to delete selected
        nodes or connections.
      </p>
    </Modal>
  );
};

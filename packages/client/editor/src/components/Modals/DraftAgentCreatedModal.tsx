import React from 'react';
import Modal from '../Modal/Modal';

/**
 * Props for the DraftAgentCreatedModal component.
 *
 * @typedef {Object} DraftAgentCreatedModalProps
 * @property {Function} closeModal - Function to close the modal.
 */

/**
 * Displays a modal informing the user about the creation of a draft agent.
 *
 * @param {DraftAgentCreatedModalProps} props
 * @returns {React.JSX.Element}
 */
const DraftAgentCreatedModal = ({ closeModal }) => {

  return (
    <Modal
      title="Draft Agent Created"
      icon="info"
    >
      <h3>Your Draft Agent Has Been Created</h3>
      <br />
      <p>
        A draft version of your agent has been successfully created. To configure
        your draft agent's settings, please visit the <strong>Config</strong> tab.
      </p>
      <br />
      <p>
        Remember, changes made in the draft version will not affect your live agent
        until you publish them.
      </p>
    </Modal>
  );
};

export default DraftAgentCreatedModal;

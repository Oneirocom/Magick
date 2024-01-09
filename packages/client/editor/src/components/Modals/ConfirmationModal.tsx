import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '@mui/material/Input/Input';

/**
 * Props for the ConfirmationModal component.
 *
 * @typedef {Object} ConfirmationModalProps
 * @property {Function} closeModal - Function to close the modal.
 * @property {Function} onConfirm - Callback function to execute on confirmation.
 * @property {string} title - Title of the confirmation modal.
 * @property {string} confirmButtonText - Text for the confirm button.
 */

/**
 * Displays a modal for general confirmation purposes.
 *
 * @param {ConfirmationModalProps} props
 * @returns {React.JSX.Element}
 */
const ConfirmationModal = ({
  closeModal,
  onConfirm,
  title,
  confirmButtonText = 'Confirm',
}: {
  closeModal: () => void
  onConfirm: (description: string) => void
  title: string
  confirmButtonText: string
}) => {

  const [description, setDescription] = useState('');
  const onSubmit = () => {
    onConfirm(description);
    closeModal();
  };

  const options = [
    {
      className: 'confirm-btn',
      label: confirmButtonText,
      onClick: onSubmit,
    }
  ];

  return (
    <Modal
      title={title}
      options={options}
      icon="info"
    >
      <h3>
        Please enter a description for what you changed in this release.
      </h3>
      <br />
      <Input
        type='text'
        name="description"
        style={{ width: '100%' }}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Fixed bug where..."
      />
    </Modal>
  );
};

export default ConfirmationModal;

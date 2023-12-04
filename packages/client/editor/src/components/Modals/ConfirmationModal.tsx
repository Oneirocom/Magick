import React from 'react';
import Modal from '../Modal/Modal';

/**
 * Props for the ConfirmationModal component.
 *
 * @typedef {Object} ConfirmationModalProps
 * @property {Function} closeModal - Function to close the modal.
 * @property {Function} onConfirm - Callback function to execute on confirmation.
 * @property {string} title - Title of the confirmation modal.
 * @property {string} confirmButtonText - Text for the confirm button.
 * @property {string} cancelButtonText - Text for the cancel button.
 * @property {React.ReactNode} children - Optional children to render inside the modal.
 */

/**
 * Displays a modal for general confirmation purposes.
 *
 * @param {ConfirmationModalProps} props
 * @returns {JSX.Element}
 */
const ConfirmationModal = ({
  closeModal,
  onConfirm, title,
  confirmButtonText = 'Confirm',
  children
}) => {

  const onSubmit = () => {
    onConfirm();
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
      className={'confirmation-modal'}
    >
      {children}
    </Modal>
  );
};

export default ConfirmationModal;

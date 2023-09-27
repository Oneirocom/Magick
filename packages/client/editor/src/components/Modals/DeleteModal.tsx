// DOCUMENTED
/**
 * This module contains the DeleteModal component which displays a modal with
 * confirmation of deletion and handles user input using react-hook-form
 *
 * @see https://github.com/react-hook-form/react-hook-form
 * @module components/ModalForms/DeleteModal
 */

import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { useForm } from 'react-hook-form'

/**
 * Props object for the DeleteModal component
 *
 * @typedef {Object} DeleteModalProps
 * @property {Function} closeModal - Function to close the modal
 * @property {Function} handledelete - Function to handle deletion of the item, passed from the parent component
 * @property {number} id - ID of the item to be deleted
 */

/**
 * Displays a modal with confirmation of deletion and handles user input using react-hook-form
 *
 * @param {DeleteModalProps} props
 * @returns {JSX.Element}
 * @throws Will throw an error if the required props are not passed
 */
const DeleteModal = ({ closeModal, handledelete, id }) => {
  if (!closeModal || !handledelete || !id) {
    throw new Error(
      'Required props closeModal, handledelete, and id not passed to DeleteModal component'
    )
  }

  const { handleSubmit } = useForm()
  const onSubmit = handleSubmit(async () => {
    handledelete(id)
    closeModal()
  })

  const options = [
    {
      className: css['delete-btn'],
      label: 'Delete',
      onClick: onSubmit,
    },
  ]

  return (
    <Modal
      title="Confirm Delete"
      options={options}
      icon="info"
      className={css['delete-modal']}
    />
  )
}

export default DeleteModal

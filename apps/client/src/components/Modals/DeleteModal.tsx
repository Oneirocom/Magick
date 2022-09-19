import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { useForm } from 'react-hook-form'

const DeleteModal = ({ closeModal, handledelete, id }) => {
  const {
    handleSubmit,
    // formState: { errors },
  } = useForm()
  const onSubmit = handleSubmit(async () => {
    handledelete(id)

    closeModal()
  })
  const options = [
    {
      className: `${css['delete-btn']}`,
      label: 'Delete',
      onClick: onSubmit,
    },
  ]

  return (
    <Modal
      title="Confirm Delete"
      options={options}
      icon="info"
      className={`${css['delete-modal']}`}
    ></Modal>
  )
}

export default DeleteModal

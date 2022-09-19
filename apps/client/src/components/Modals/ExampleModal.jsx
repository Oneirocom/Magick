import { useModal } from '../../contexts/ModalProvider'
import Modal from '../Modal/Modal'

const ExampleModal = ({ content }) => {
  const { closeModal } = useModal()
  const options = [
    { label: 'Oki doki', className: 'primary', onClick: closeModal },
  ]
  return (
    <Modal title="Example" options={options} icon="info">
      <p> {content} </p>
    </Modal>
  )
}

export default ExampleModal

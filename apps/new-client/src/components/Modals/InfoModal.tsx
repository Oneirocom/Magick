import Modal from '../../components/Modal/Modal'

interface InfoModal {
  title: string
  content: string
  checkbox?: {
    onClick: () => {}
    label: string
  }
}

const InfoModal = ({ title, content, checkbox }: InfoModal) => {
  return (
    <Modal title={title} icon="info">
      <p style={{ whiteSpace: 'pre-line' }}> {content} </p>
      {checkbox && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <label htmlFor="acknowledgment-input">{checkbox.label}</label>
          <input
            id="acknowledgment-input"
            type="checkbox"
            onClick={checkbox.onClick}
          />
        </div>
      )}
    </Modal>
  )
}

export default InfoModal

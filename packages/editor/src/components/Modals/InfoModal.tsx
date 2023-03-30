import Modal from '../Modal/Modal'

interface InfoModal {
  title: string
  content: string
  checkbox?: {
    onClick: () => void
    label: string
  }
}

const InfoModal = ({ title, content, checkbox }: InfoModal) => {
  return (
    <Modal title={title} icon="info">
      <p
        style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: '24px' }}
      >
        {' '}
        {content}{' '}
      </p>
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
            placeholder={checkbox.label}
          />
        </div>
      )}
    </Modal>
  )
}

export default InfoModal

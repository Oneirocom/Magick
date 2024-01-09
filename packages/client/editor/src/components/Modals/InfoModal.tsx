// DOCUMENTED
/**
 * Represents the contents and behavior of an information modal that displays a title, some content and an optional checkbox.
 */
import Modal from '../Modal/Modal'
interface InfoModalProps {
  /** Title of the information modal */
  title: string
  /** Content of the information modal */
  content: string
  /** Checkbox information, if any */
  checkbox?: {
    /** Checkbox click handler */
    onClick: () => void
    /** Checkbox label */
    label: string
  }
}

/**
 * Renders an information modal containing the provided title, content and optional checkbox.
 * @param props The InfoModalProps object containing the title, content and optional checkbox.
 * @returns A JSX element of the information modal.
 */
const InfoModal = ({
  title,
  content,
  checkbox,
}: InfoModalProps): React.JSX.Element => {
  return (
    <Modal title={title} icon="info">
      {/* Use white-space pre-line to preserve line breaks in content */}
      <p
        style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: '24px' }}
      >
        {content}
      </p>
      {/* Render the checkbox if it exists */}
      {checkbox && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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

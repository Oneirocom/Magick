import { useModal } from '../../contexts/ModalProvider'
import Button from '../Button'
import Icon from '../Icon/Icon'
import css from './modal.module.css'

const Modal = ({ options = [], title, icon, onClose = () => {}, ...props }) => {
  const { closeModal } = useModal()
  return (
    <div className={css['modal-bg']}>
      <div className={css['modal-panel']}>
        <div className={css['modal-panel-content']}>
          <div className={css['modal-title']}>
            {icon && (
              <Icon
                size={24}
                name={icon}
                style={{ marginRight: 'var(--extraSmall)' }}
              />
            )}
            <h1
              type="header"
              size="large"
              style={{ marginBottom: 'var(--small)' }}
            >
              {title}
            </h1>
          </div>
          <div
            style={{
              margin: icon ? 'var(--c4)' : 0,
              marginTop: 0,
            }}
          >
            {props.children}
          </div>
        </div>
        <div className={`${css['modal-action-strip']}`}>
          <Button
            onClick={() => {
              closeModal()
              onClose()
            }}
          >
            Close
          </Button>
          {options &&
            options.map(item => {
              return (
                <Button
                  key={item.label}
                  disabled={item.disabled || false}
                  onClick={item.onClick}
                  className={`${item.className} ${item.disabled && 'disabled'}`}
                >
                  {item.label}
                </Button>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default Modal

// DOCUMENTED
/**
 * A component for displaying modal windows.
 * @param {Object} options Array of option to display inside the modal window.
 * @param {string} title Title of the modal window.
 * @param {string} icon Name of the icon to display next to the title of the modal window.
 * @param {function} onClose Function to call when the close button is clicked.
 * @returns {React.JSX.Element} Modal component.
 */
import React, { useCallback } from 'react'
import { useModal } from '../../contexts/ModalProvider'
import { Icon } from '@magickml/icons'
import css from './modal.module.css'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from '@magickml/client-ui'

const Modal = ({
  options,
  title,
  icon,
  children,
  onClose,
  className,
  ...props
}: {
  title: string
  icon?: string
  options?: any[]
  className?: string
  children?: React.ReactNode
  onClose?: () => void
}) => {
  const { closeModal } = useModal()

  /**
   * Function to handle clicks on the modal background.
   * It stops propagation, closes the modal window and calls the onClose function.
   * @param {Object} e The event object.
   */
  const handleModalBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      closeModal()
      if (onClose) onClose()
    },
    [closeModal, onClose]
  )

  /**
   * Function to handle clicks on the modal panel.
   * It stops propagation to avoid closing the modal window and only interact with the panel elements.
   * @param {Object} e The event object.
   */
  const handleModalPanelClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])
  /**
   * Function to render the options buttons inside the modal action strip.
   * It maps over the options array and generates a button for each item.
   * @returns {React.JSX.Element[]} Array of option buttons JSX elements.
   */
  const renderOptions = () => {
    return (
      options &&
      options.map(item => {
        if (item.component) {
          return item.component
        }
        return (
          <Button
            key={item.label}
            variant="default"
            disabled={item.disabled || false}
            onClick={item.onClick}
            className={`${item.disabled && 'disabled'}`}
          >
            {item.label}
          </Button>
        )
      })
    )
  }

  /**
   * Function to find and call the first enabled option's onClick function.
   */
  const handleEnterPress = () => {
    const firstEnabledOption = options?.find(option => !option.disabled)
    if (firstEnabledOption) {
      firstEnabledOption.onClick()
    }
  }

  // Close the modal when Escape key is pressed
  useHotkeys('escape', () => {
    closeModal()
    onClose && onClose()
  })

  useHotkeys('enter', handleEnterPress)

  return (
    <div className={css['modal-bg']} onClick={handleModalBackgroundClick}>
      <div className={css['modal-panel']} onClick={handleModalPanelClick}>
        <div className="p-8 min-w-[500px]">
          <div className={css['modal-title']}>
            {icon && (
              <Icon
                size={24}
                name={icon as any}
                style={{ marginRight: 'var(--extraSmall)' }}
              />
            )}
            <h1 className="text-2xl">{title}</h1>
          </div>
          <div
            style={{
              margin: icon ? 'var(--c4)' : 0,
              marginTop: 0,
            }}
          >
            {children}
          </div>
        </div>
        <div className="p-4 flex justify-end gap-4">
          <Button variant="outline" onClick={handleModalBackgroundClick}>
            Close
          </Button>
          {renderOptions()}
        </div>
      </div>
    </div>
  )
}

export default Modal

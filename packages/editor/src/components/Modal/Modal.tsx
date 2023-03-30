// GENERATED 
/**
 * A component for displaying modal windows.
 * @param {Object} options Array of option to display inside the modal window.
 * @param {string} title Title of the modal window.
 * @param {string} icon Name of the icon to display next to the title of the modal window.
 * @param {function} onClose Function to call when the close button is clicked.
 * @returns {JSX.Element} Modal component.
 */
import React from 'react';
import { useModal } from '../../contexts/ModalProvider';
import { Button } from '@magickml/client-core';
import { Icon } from '@magickml/client-core';
import css from './modal.module.css';

const Modal = ({ options = [], title, icon, onClose = () => {}, ...props }) => {
  const { closeModal } = useModal();

  /**
   * Function to handle clicks on the modal background.
   * It stops propagation, closes the modal window and calls the onClose function.
   * @param {Object} e The event object.
   */
  const handleModalBackgroundClick = (e) => {
    e.stopPropagation();
    closeModal();
    onClose();
  }

  /**
   * Function to handle clicks on the modal panel.
   * It stops propagation to avoid closing the modal window and only interact with the panel elements.
   * @param {Object} e The event object.
   */
  const handleModalPanelClick = (e) => {
    e.stopPropagation();
  }

  /**
   * Function to render the options buttons inside the modal action strip.
   * It maps over the options array and generates a button for each item.
   * @returns {JSX.Element[]} Array of option buttons JSX elements.
   */
  const renderOptions = () => {
    return options &&
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
      });
  };

  return (
    <div
      className={css['modal-bg']}
      onClick={handleModalBackgroundClick}
    >
      <div
        className={css['modal-panel']}
        onClick={handleModalPanelClick}
      >
        <div className={css['modal-panel-content']}>
          <div className={css['modal-title']}>
            {icon && (
              <Icon
                size={24}
                name={icon}
                style={{ marginRight: 'var(--extraSmall)' }}
              />
            )}
            <h1 style={{ marginBottom: 'var(--small)' }}>{title}</h1>
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
            onClick={handleModalBackgroundClick}
          >
            Close
          </Button>
          {renderOptions()}
        </div>
      </div>
    </div>
  );
};

export default Modal;
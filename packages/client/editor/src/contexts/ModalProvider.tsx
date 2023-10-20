// DOCUMENTED

import React, { useState } from 'react'

import { getModals } from '../components/Modals'

/**
 * Type for the context object used throughout the application regarding modals
 */
type MyContextType = {
  activeModal: object
  modalName: string
  openModal: (options: object) => void
  closeModal: () => void
}

/**
 * Default context values
 */
const defaultContext: MyContextType = {
  activeModal: {},
  modalName: '',
  openModal: (options: object) => {
    /* null */
  },
  closeModal: () => {
    /* null */
  },
}

/**
 * Context object declaration
 */
const Context = React.createContext<MyContextType>(defaultContext)

/**
 * Custom hook for using the Modal context
 */
export const useModal = () => React.useContext(Context)

/**
 * ModalContext component responsible for managing the application modals
 * @param {React.PropsWithChildren<unknown>} { children } - Child components
 * @returns {React.ReactNode} - The ModalContext provider with its children
 */
const ModalContext: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  // Initialize modal list
  const modalList = getModals()

  // Declare state for active modal and modal name
  const [activeModal, setActiveModal] = useState<Record<string, any> | null>(
    null
  )
  const [modalName, setModalName] = useState<string>('')

  // Open the modal with the specified options and attach closeModal function
  const openModal = (modalOptions: { modal: string }) => {
    setModalName(modalOptions.modal)
    setActiveModal({ ...modalOptions, closeModal })
  }

  // Close the currently active modal
  const closeModal = () => {
    setActiveModal(null)
  }

  // Get the Modal component by its name
  const Modal = modalList[modalName]

  return (
    <Context.Provider
      value={{
        openModal,
        closeModal,
        activeModal,
        modalName,
      }}
    >
      {activeModal && <Modal {...activeModal} />}
      {children}
    </Context.Provider>
  )
}

export default ModalContext

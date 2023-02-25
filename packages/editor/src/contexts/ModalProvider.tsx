import React, { useState } from 'react'

import { getModals } from '../components/Modals'

// todo this whole thing is really messy.  Fix. Maybe find a robust modal library
const Context = React.createContext({
  activeModal: {},
  modalName: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openModal: options => {},
  closeModal: () => {},
})

export const useModal = () => React.useContext(Context)

const ModalContext = ({ children }) => {
  const modalList = getModals()
  const [activeModal, setActiveModal] = useState<Record<string, any> | null>(
    null
  )
  const [modalName, setModalName] = useState<string>('')

  const openModal = modalOptions => {
    setModalName(modalOptions.modal)
    setActiveModal({ ...modalOptions, closeModal })
  }

  const closeModal = () => {
    setActiveModal(null)
  }

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

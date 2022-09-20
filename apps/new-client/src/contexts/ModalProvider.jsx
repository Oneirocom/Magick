import React, { useState } from 'react'

import { getModals } from '../components/Modals'

const Context = React.createContext({
  activeModal: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openModal: options => { },
  closeModal: () => { },
})

export const useModal = () => React.useContext(Context)

const ModalContext = ({ children }) => {
  const modalList = getModals()
  const [activeModal, setActiveModal] = useState('')

  const openModal = modalOptions => {
    setActiveModal({ ...modalOptions, closeModal })
  }

  const closeModal = () => {
    setActiveModal('')
  }
  const Modal = modalList[activeModal.modal]

  return (
    <Context.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {activeModal && <Modal {...activeModal} />}
      {children}
    </Context.Provider>
  )
}

export default ModalContext

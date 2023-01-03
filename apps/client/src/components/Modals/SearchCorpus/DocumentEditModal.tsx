process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { useState } from 'react'
import Modal from '../../Modal/Modal'
import css from '../modalForms.module.css'
import axios from 'axios'
import { useSnackbar } from 'notistack'

const capitalizeFirstLetter = (word: string) => {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const DocumentEditModal = ({ closeModal, field, document, getDocuments }) => {
  const [val, setValue] = useState(document[field])
  const { enqueueSnackbar } = useSnackbar()

  const update = async () => {
    console.log('value ::: ', val)
    const { id, ..._document } = document
    const body = {
      ..._document,
      documentId: id,
      [field]: val,
    }
    console.log('body ::: ', body)
    await axios.post(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/update_document`,
      body
    )
    enqueueSnackbar('Document updated', { variant: 'success' })
    await getDocuments()
    closeModal()
  }

  const options = [
    {
      className: `${css['loginButton']} secondary`,
      label: 'Update',
      onClick: update,
    },
  ]

  return (
    <Modal title="Edit Document" icon="add" options={options}>
      <form>
        <div className="form-item">
          <span className="form-item-label">
            {capitalizeFirstLetter(field)}
          </span>
          <input
            type="text"
            className="form-text-area"
            defaultValue={val}
            onChange={e => setValue(e.target.value)}
          ></input>
        </div>
      </form>
    </Modal>
  )
}

export default DocumentEditModal

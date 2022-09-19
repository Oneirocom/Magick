import { useState } from 'react'
import Modal from '../../Modal/Modal'
import css from '../modalForms.module.css'
import axios from 'axios'
import { useSnackbar } from 'notistack'

const DocumentAddModal = ({
  closeModal,
  storeId,
  documentId,
  isContentObject,
  getDocuments,
  getContentObjects,
}) => {
  let parentId = isContentObject ? 'documentId' : 'storeId'
  let doc = {
    title: '',
    description: '',
    isIncluded: true,
    [parentId]: isContentObject ? parseInt(documentId) : parseInt(storeId),
  }
  const title = isContentObject ? 'Add Content Object' : 'Add Document'
  const [newDocument, setNewDocument] = useState(doc)
  const [updated, setUpdated] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const add = async () => {
    if (newDocument.description?.length === 0) {
      enqueueSnackbar('Empty document!', { variant: 'error' })
      return
    }

    const body = { ...newDocument }
    let url = isContentObject
      ? `${process.env.REACT_APP_SEARCH_SERVER_URL}/content-object`
      : `${process.env.REACT_APP_SEARCH_SERVER_URL}/document`

    try {
      await axios.post(url, body)
    } catch (err) {
      enqueueSnackbar('Bad request!', {
        variant: 'error',
      })
      closeModal()
      return
    }

    await getDocuments()
    if (isContentObject) {
      enqueueSnackbar('Content Object created', { variant: 'success' })
      await getContentObjects()
    } else enqueueSnackbar('Document created', { variant: 'success' })
    closeModal()
  }

  const showFile = async (e: any) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (_e: any) => {
      const text = _e.target.result
      if (text && text !== undefined && text.length > 0) {
        newDocument.description = text
        setUpdated(!updated)
      }
    }

    reader.readAsText(e.target.files[0])
  }

  const options = [
    {
      className: `${css['loginButton']} secondary`,
      label: 'Add',
      onClick: add,
    },
  ]
  return (
    <Modal title={title} icon="add" options={options}>
      <form>
        <div className="form-item d-flex align-items-center">
          <input
            type="checkbox"
            name="include"
            className="custom-checkbox"
            onChange={e =>
              setNewDocument({
                ...newDocument,
                isIncluded: !newDocument.isIncluded,
              })
            }
            checked={newDocument.isIncluded}
          />
          <span className="form-item-label" style={{ marginBottom: 'unset' }}>
            Include
          </span>
        </div>
        <div className="form-item">
          <span className="form-item-label">Title</span>
          <input
            type="text"
            className="form-text-area"
            onChange={e =>
              setNewDocument({
                ...newDocument,
                title: e.target.value,
              })
            }
            value={newDocument.title}
          ></input>
        </div>
        <div className="form-item">
          <span className="form-item-label">Description</span>
          <input
            type="text"
            className="form-text-area"
            onChange={e =>
              setNewDocument({
                ...newDocument,
                description: e.target.value,
              })
            }
            value={newDocument.description}
          ></input>
        </div>
        <div className="form-item">
          <input
            type="file"
            accept=".txt, .doc .csv"
            onChange={e => showFile(e)}
          />
        </div>
      </form>
    </Modal>
  )
}

export default DocumentAddModal

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import Modal from '../../Modal/Modal'
import css from '../modalForms.module.css'
import axios from 'axios'
import { useSnackbar } from 'notistack'

const DocumentDeleteModal = ({
  closeModal,
  documentId,
  objId,
  isContentObj,
  getDocuments,
  getContentObjects,
}) => {
  let url = isContentObj
    ? `${process.env.REACT_APP_SEARCH_SERVER_URL}/content-object`
    : `${process.env.REACT_APP_SEARCH_SERVER_URL}/document`
  let params = isContentObj
    ? {
        objId,
      }
    : {
        documentId,
      }
  let entityToDelete = isContentObj ? 'content' : 'document'
  const { enqueueSnackbar } = useSnackbar()

  const deleteEntity = async () => {
    try {
      await axios.delete(url, { params: params })
    } catch (err) {
      enqueueSnackbar('Bad request!', {
        variant: 'error',
      })
      closeModal()
      return
    }

    if (isContentObj) {
      enqueueSnackbar('Content object removed', { variant: 'success' })
      await getContentObjects()
    } else {
      enqueueSnackbar('Document removed', { variant: 'success' })
      await getDocuments()
    }
    closeModal()
  }

  const options = [
    {
      className: `${css['loginButton']} secondary`,
      label: 'Delete',
      onClick: deleteEntity,
    },
  ]

  return (
    <Modal title="Warning" icon="warn" options={options}>
      <p style={{ whiteSpace: 'pre-line' }}>
        Are you sure to delete the {entityToDelete}?
      </p>
    </Modal>
  )
}

export default DocumentDeleteModal

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

//@ts-nocheck
import Modal from '../../Modal/Modal'
import css from '../modalForms.module.css'
import axios from 'axios'
import { useSnackbar } from 'notistack'

const StoreDeleteModal = ({ closeModal, store, getDocumentsStores }) => {
  const { enqueueSnackbar } = useSnackbar()

  const deleteStore = async () => {
    await axios.delete(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/document-store`,
      {
        params: {
          storeId: store.id,
        },
      }
    )
    await getDocumentsStores()
    enqueueSnackbar('Document Store removed', { variant: 'success' })
    closeModal()
  }

  const options = [
    {
      className: `${css['loginButton']} secondary`,
      label: 'Delete',
      onClick: deleteStore,
    },
  ]

  return (
    <Modal title="Warning" icon="warn" options={options}>
      <p style={{ whiteSpace: 'pre-line' }}>
        Are you sure to delete store `{store.name}`?
      </p>
    </Modal>
  )
}

export default StoreDeleteModal

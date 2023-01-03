import InfoModal from './InfoModal'
import EditSpellModal from './EditSpellModal'
import SaveAsModal from './SaveAsModal'
import DeleteModal from './DeleteModal'
import StoreAddEditModal from './SearchCorpus/StoreAddEditModal'
import StoreDeleteModal from './SearchCorpus/StoreDeleteModal'
import DocumentAddModal from './SearchCorpus/DocumentAddModal'
import DocumentEditModal from './SearchCorpus/DocumentEditModal'
import DocumentDeleteModal from './SearchCorpus/DocumentDeleteModal'
import ContentObjEditModal from './SearchCorpus/ContentObjEditModal'

const modals = {
  infoModal: InfoModal,
  editSpellModal: EditSpellModal,
  saveAsModal: SaveAsModal,
  deleteModal: DeleteModal,
  documentStoreAddEditModal: StoreAddEditModal,
  documentStoreDeleteModal: StoreDeleteModal,
  documentAddModal: DocumentAddModal,
  documentEditModal: DocumentEditModal,
  documentDeleteModal: DocumentDeleteModal,
  contentObjEditModal: ContentObjEditModal,
}

export const getModals = () => {
  return modals
}

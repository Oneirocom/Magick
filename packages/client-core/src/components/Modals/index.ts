import InfoModal from './InfoModal'
import EditSpellModal from './EditSpellModal'
import SaveAsModal from './SaveAsModal'
import DeleteModal from './DeleteModal'

const modals = {
  infoModal: InfoModal,
  editSpellModal: EditSpellModal,
  saveAsModal: SaveAsModal,
  deleteModal: DeleteModal,
}

export const getModals = () => {
  return modals
}

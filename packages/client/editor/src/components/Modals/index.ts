// DOCUMENTED
/**
 * Represents a collection of modals for handling different interactions.
 */
import InfoModal from './InfoModal'
import EditSpellModal from './EditSpellModal'
import SaveAsModal from './SaveAsModal'
import DeleteModal from './DeleteModal'
import CreateSpellModal from './CreateSpellModal'

// A dictionary of modals with their names and components
const modals = {
  infoModal: InfoModal,
  editSpellModal: EditSpellModal,
  saveAsModal: SaveAsModal,
  deleteModal: DeleteModal,
  createSpellModal: CreateSpellModal,
}

/**
 * Returns a collection of modals with their names and components.
 * @returns {Object} A dictionary of modals with their names and components.
 */
export const getModals = (): any => {
  return modals
}

// DOCUMENTED
/**
 * Represents a collection of modals for handling different interactions.
 */
import InfoModal from './InfoModal'
import SaveAsModal from './SaveAsModal'
import DeleteModal from './DeleteModal'
import CreateSpellModal from './CreateSpellModal'
import ConfirmationModal from './ConfirmationModal'
import DraftAgentCreatedModal from './DraftAgentCreatedModal'

// A dictionary of modals with their names and components
const modals = {
  infoModal: InfoModal,
  saveAsModal: SaveAsModal,
  deleteModal: DeleteModal,
  createSpellModal: CreateSpellModal,
  confirmationModal: ConfirmationModal,
  draftAgentCreatedModal: DraftAgentCreatedModal,
}

/**
 * Returns a collection of modals with their names and components.
 * @returns {Object} A dictionary of modals with their names and components.
 */
export const getModals = (): any => {
  return modals
}

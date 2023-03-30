// GENERATED 
/**
 * A custom Modal component that renders a Material-UI dialog with customizable content and actions.
 *
 * @param {*} open - A boolean value that determines whether the Modal is currently open.
 * @param {*} setOpen - A callback function to set the open state of the Modal.
 * @param {*} handleAction - An optional function that will be called when the save button is clicked.
 * @param {*} props
 * @returns {*} The Modal component.
 * 
 * @example
 * 
 * <Modal
 *  open={modalOpen}
 *  setOpen={setModalOpen}
 *  handleAction={handleSave}
 * >
 *  <p>Some content goes here</p>
 * </Modal>
*/

// Import Material-UI components and styles
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import Button from '@mui/material/Button'
import styles from './index.module.scss'

export const Modal = ({ open, setOpen, handleAction, ...props }) => {
  /**
   * Closes the Modal by setting the open state to false.
   */
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: styles.paper }}
    >
      <DialogContent classes={{ root: styles.content }}>
        <DialogContentText id="alert-dialog-description">
          {props.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions classes={{ root: styles.actions }}>
        {/* Render the Cancel button */}
        <Button onClick={handleClose} className={styles.btnCancel}>
          Cancel
        </Button>
        {/* Render the save button if handleAction is provided */}
        {handleAction !== undefined && (
          <Button
            onClick={() => {
              handleAction()
              handleClose()
            }}
            className={styles.btnAction}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
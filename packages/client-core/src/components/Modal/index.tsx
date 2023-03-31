// GENERATED 
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import styles from './index.module.scss';

/**
 * Modal component to display a dialog with action buttons.
 *
 * @param {Object} props - The properties for the Modal component.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.setOpen - The function to set the dialog open state.
 * @param {Function} [props.handleAction] - The function to call when the action button is clicked.
 * @param {*} [props.children] - The child elements to display inside the dialog.
 */
export const Modal = ({ open, setOpen, handleAction, ...props }) => {
  /**
   * Function to handle closing the dialog.
   */
  const handleClose = () => {
    setOpen(false);
  };

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
        <Button onClick={handleClose} className={styles.btnCancel}>
          Cancel
        </Button>
        {handleAction !== undefined && (
          <Button
            onClick={() => {
              handleAction();
              handleClose();
            }}
            className={styles.btnAction}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
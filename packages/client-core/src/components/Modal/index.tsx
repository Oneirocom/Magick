// GENERATED 
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import styles from './index.module.scss';

/**
 * Modal component for displaying content with actions
 * @param open - boolean to open or close the modal
 * @param setOpen - function to update the open state
 * @param handleAction - function to handle the action button click
 * @param props - additional props that may be needed
 */
export const Modal = ({
  open,
  setOpen,
  handleAction,
  ...props
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAction?: () => void;
}) => {
  /**
   * Function to close the modal
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
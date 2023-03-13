import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import styles from './index.module.scss'
export const Modal = ({ open, setOpen, handleAction, ...props }) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: styles.paper }}
        style={{ padding: '1rem' }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className={styles.btnCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAction()
              handleClose()
            }}
            className={styles.btnAction}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

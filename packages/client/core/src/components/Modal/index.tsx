// DOCUMENTED
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import styles from './index.module.scss'
import { DialogTitle } from '@mui/material'
import React from 'react'
import { Button } from '@magickml/ui'

/**
 * Modal component to display a dialog with action buttons.
 *
 * @param {Object} props - The properties for the Modal component.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.setOpen - The function to set the dialog open state.
 * @param {Function} [props.handleAction] - The function to call when the action button is clicked.
 * @param {*} [props.children] - The child elements to display inside the dialog.
 */
interface Props {
  open: boolean
  submitText?: string
  title?: string
  onClose: () => void
  handleAction?: () => void
  children?: React.ReactNode
  showSaveBtn?: boolean
}

export const Modal = ({
  open,
  onClose,
  handleAction,
  submitText,
  title,
  children,
  showSaveBtn = true,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: styles.paper }}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent classes={{ root: styles.content }}>
        <DialogContentText id="alert-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions classes={{ root: styles.actions }}>
        <Button
          onClick={onClose}
          variant="outline"
          className={styles.btnCancel}
        >
          Cancel
        </Button>
        {handleAction !== undefined && showSaveBtn === true && (
          <Button
            variant="default"
            onClick={() => {
              handleAction()
            }}
          >
            {submitText || 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

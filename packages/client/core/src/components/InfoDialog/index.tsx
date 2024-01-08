// DOCUMENTED
import React, { useRef, useEffect } from 'react'
import {
  DialogTitle,
  IconButton,
  Typography,
  DialogContent,
  Menu,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import styles from './index.module.scss'

/**
 * The props for the DialogTitle component.
 */
export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

/**
 * A custom dialog title with a close button.
 *
 * @param props - The properties for the dialog title.
 * @returns The dialog title component.
 */
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
            background: 'var(--dark-2)',
          }}
        >
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

/**
 * The InfoDialog component is used to display additional information on top of the currently
 * displayed content.
 *
 * @param {string} title - The title text of the info dialog.
 * @param {string} body - The body text of the info dialog.
 * @param {React.CSSProperties} [style] - Custom styles to apply to the info dialog.
 * @returns {React.JSX.Element} The info dialog component.
 */
const InfoDialog = ({ title, body, style }): React.JSX.Element => {
  const anchorRef = useRef<null | HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLDivElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!anchorRef.current) return
    anchorRef.current.click()
  }, [])

  return (
    <>
      <div style={style} ref={anchorRef} onClick={handleClick}></div>

      {open && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}
          classes={{ paper: styles.root }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <div className={styles['sharp-edge-menu']}></div>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            {title}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography style={{ width: '500px' }}>{body}</Typography>
          </DialogContent>
        </Menu>
      )}
    </>
  )
}

export default InfoDialog

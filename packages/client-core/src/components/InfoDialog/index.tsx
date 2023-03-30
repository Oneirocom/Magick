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

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

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

const InfoDialog = ({ title, body, style }) => {
  const anchorRef = useRef(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    anchorRef.current.click()
  }, [])

  return (
    <>
      <div style={style} ref={anchorRef} onClick={handleClick}>
        {' '}
      </div>

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

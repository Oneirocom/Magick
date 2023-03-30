// GENERATED 
import React, { useRef, useEffect } from 'react';
import {
  DialogTitle,
  IconButton,
  Typography,
  DialogContent,
  Menu,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './index.module.scss';

/**
 * Props for the custom dialog title.
 */
export interface BootstrapDialogTitleProps {
  /** The id for the dialog title. */
  id: string;
  /** The child elements for the dialog title. */
  children?: React.ReactNode;
  /** Function to close the dialog. */
  onClose: () => void;
}

/**
 * A custom dialog title component for the info dialog.
 * @param props - The title properties.
 * @returns The rendered dialog title.
 */
function BootstrapDialogTitle(props: BootstrapDialogTitleProps) {
  const { children, onClose, ...other } = props;

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
            color: (theme) => theme.palette.grey[500],
            background: 'var(--dark-2)',
          }}
        >
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

/**
 * The properties for the info dialog.
 */
export interface InfoDialogProps {
  /** The title for the info dialog. */
  title: string;
  /** The body for the info dialog. */
  body: string;
  /** The CSS style for the information element. */
  style?: React.CSSProperties;
}

/**
 * A dialog component that displays information.
 * @param title - The title for the info dialog.
 * @param body - The body for the info dialog.
 * @param style - The CSS style for the information element.
 * @returns The rendered information dialog component.
 */
const InfoDialog = ({ title, body, style }: InfoDialogProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /**
   * Handle clicks on the information element to open the dialog.
   */
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles closing the dialog.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    anchorRef.current?.click(); // optionally add the optional chaining operator to ensure that we don't access a null object reference
  }, []);

  return (
    <>
      <div style={style} ref={anchorRef} onClick={handleClick} />

      {open && (
        // Use the Paper element style for the Menu component paper
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
          {/* Display a 'sharp-edge-menu' DIV as the background of the menu */}
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
  );
};

export default InfoDialog;
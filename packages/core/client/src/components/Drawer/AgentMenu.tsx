import React from 'react';
import { CSSObject, Theme, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Popper } from '@mui/material';
import Fade from '@mui/material/Fade';
import MoreIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AddCircleIcon from '@mui/icons-material/AddCircle';


function AgentMenu() {
  const BorderedAvatar = styled(Avatar)`
    border: 3px solid lightseagreen;
  `;

  const [open, setOpen] = React.useState(false);
  const [sopen, setSOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const anchorSRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleSClose = (event) => {
    if (anchorSRef.current && anchorSRef.current.contains(event.target)) {
      return;
    }
    setSOpen(false);
  };

  const handleSToggle = () => {
    setSOpen((prevOpen) => !prevOpen);
  };


  return (
    <div>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-center">
          <ListItemAvatar>
            <BorderedAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 30, height: 30 }} />
          </ListItemAvatar>
          <ListItemText primary="Agent name" />
          <IconButton
            aria-label="expand"
            size="small"
            onClick={handleToggle}
            ref={anchorRef}
            edge="end"
          >
            <ExpandMoreIcon />
          </IconButton>
        </ListItem>
      </List>
      {/* select agent modal */}
      <Menu
        id="positioned-demo-menu"
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        aria-labelledby="positioned-demo-button"
      >
        <MenuItem sx={{
          px: 1,
          py: 0,
          width: 200,
          justifyContent: 'space-between',
        }}>
          <ListItemAvatar sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <BorderedAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 24, height: 24 }} />
            <ListItemText primary="Agent1" sx={{
              ml: 2,
            }} />
          </ListItemAvatar>
          <ListItemIcon >
            <MoreIcon fontSize="small" onClick={handleSToggle}
              ref={anchorSRef} />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem sx={{
          px: 1,
          py: 0,
          width: 200,
          justifyContent: 'space-between',
        }}>
          <ListItemAvatar sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <BorderedAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 24, height: 24 }} />
            <ListItemText primary="Agent2" sx={{
              ml: 2,
            }} />
          </ListItemAvatar>
          <ListItemIcon >
            <MoreIcon fontSize="small" onClick={handleSToggle}
              ref={anchorSRef} />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <List sx={{
            px: 0,
            py: 0,
          }}>
            <ListItem
              sx={{

                px: 0,
                py: 0,
              }}
            >
              <AddCircleIcon sx={{
                mr: 1,
              }} />
              <ListItemText primary="Create New Agent" />
            </ListItem>
          </List>
        </MenuItem>
      </Menu>
      {/* second mini menu */}
      <Menu
        id="sub_menu"
        anchorEl={anchorSRef.current}
        open={sopen}
        onClose={handleSClose}
        aria-labelledby="sub_menu"
      >
        <MenuItem sx={{ py: 0 , width:180 }}  >
          Rename
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 0 }} >
          Delete
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 0 }} >
          Change Image
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 0 }} >
          Other Options
        </MenuItem>
      </Menu>
    </div>
  );
}

export default AgentMenu;

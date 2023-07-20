import React from 'react';
import { CSSObject, Theme, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Popper } from '@mui/material';
import Fade from '@mui/material/Fade';
import MoreIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AddCircleIcon from '@mui/icons-material/AddCircle';


function AgentMenu() {
  const BorderedAvatar = styled(Avatar)`
    border: 3px solid lightseagreen;
  `;

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-center">
          <ListItemAvatar>
            <BorderedAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
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

      <MenuList
        id="positioned-demo-menu"
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        aria-labelledby="positioned-demo-button"
       

      >
        <MenuItem onClick={handleClose}>
<ListItemAvatar>
            <BorderedAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText>Copy</ListItemText>
          <ListItemIcon>
            <MoreIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem >

          Draft post
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
      </MenuList>
    </div>
  );
}

export default AgentMenu;

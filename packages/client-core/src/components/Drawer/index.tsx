// GENERATED 
import { ClientPlugin, ClientPluginManager, pluginManager } from '@magickml/engine';
import AppsIcon from '@mui/icons-material/Apps';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BoltIcon from '@mui/icons-material/Bolt';
import DocumentIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import ProjectIcon from '@mui/icons-material/Home';
import StorageIcon from '@mui/icons-material/Storage';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SetAPIKeys } from './SetAPIKeys';
import MagickLogo from './purple-logo-full.png';
import MagickLogoSmall from './purple-logo-small.png';

// Drawer width
const drawerWidth = 150;

/**
 * CSS mixin for opening the drawer.
 * @param {Theme} theme - A MUI theme object.
 * @returns {CSSObject} - The CSS object for open drawer.
 */
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

/**
 * CSS mixin for closing the drawer.
 * @param {Theme} theme - A MUI theme object.
 * @returns {CSSObject} - The CSS object for closed drawer.
 */
const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(3)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(5)} + 1px)`,
  },
});

type HeaderProps = {
  open: boolean;
};

/**
 * Drawer header styled component.
 */
const DrawerHeader = styled('div', {
  shouldForwardProp: (prop) => prop !== 'open',
})<HeaderProps>(({ theme, open }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  left: 3,
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

/**
 * Styled drawer component.
 */
const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

/**
 * Component for a single drawer item.
 * @param {object} props - The component properties.
 * @param {React.ReactNode} props.Icon - The icon component for the drawer item.
 * @param {boolean} props.open - Drawer open state.
 * @param {string} props.text - The drawer item text.
 * @param {boolean} props.active - The drawer item active state.
 * @param {Function} [props.onClick] - The onClick event handler for the drawer item.
 * @returns {JSX.Element} - The drawer item component.
 */
const DrawerItem = ({
  Icon,
  open,
  text,
  active,
  onClick = () => {
    /* null handler */
  },
}): JSX.Element => (
  <ListItem key={text} disablePadding sx={{ display: 'block' }}>
    <ListItemButton
      sx={{
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
      }}
      onClick={onClick}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 2 : 'auto',
          justifyContent: 'center',
          color: active ? 'var(--glow)' : 'white',
        }}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
    </ListItemButton>
  </ListItem>
);

/**
 * Component for plugin drawer items.
 * @param {object} params - The component properties.
 * @param {Function} [params.onClick] - The onClick event handler for the plugin drawer items.
 * @param {boolean} [params.open] - Drawer open state.
 * @returns {JSX.Element} - The plugin drawer items component.
 */
const PluginDrawerItems = ({ onClick, open }): JSX.Element => {
  const location = useLocation();
  const drawerItems = (pluginManager as ClientPluginManager).getDrawerItems();
  let lastPlugin: string | null = null;
  let divider = false;
  return (
    <>
      {drawerItems.map((item, index) => {
        if (item.plugin !== lastPlugin) {
          divider = true;
          lastPlugin = item.plugin;
        } else {
          divider = false;
        }
        return (
          <div key={item.path}>
            {divider && <Divider />}
            <DrawerItem
              key={item.path}
              active={location.pathname.includes(item.path)}
              Icon={item.icon}
              open={open}
              onClick={onClick(item.path)}
              text={item.text}
            />
          </div>
        );
      })}
    </>
  );
};

/**
 * Main Drawer component.
 * @param {object} props - The component properties.
 * @param {React.ReactNode} props.children - The children components.
 * @returns {JSX.Element} - The Drawer component.
 */
export function Drawer({ children }): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAPIKeysSet, setAPIKeysSet] = useState(false);

  const [open, setOpen] = useState<boolean>(false);

  /**
   * Toggles the drawer open state.
   */
  const toggleDrawer = (): void => {
    setOpen(!open);
  };

  /**
   * Handles the onClick event for drawer items.
   * @param {string} location - The target location for navigation.
   * @returns {Function} - A callback function to navigate when a drawer item is clicked.
   */
  const onClick = (location): (() => void) => (): void => {
    navigate(location);
  };

  // Update local storage for API keys
  useEffect(() => {
    const secrets = localStorage.getItem('secrets');
    if (secrets) {
      let secretHasBeenSet = false;
      const parsedSecrets = JSON.parse(secrets);
      // check if any of the parsed secrets are not ''
      Object.keys(parsedSecrets).forEach((key) => {
        if (parsedSecrets[key] !== '' && parsedSecrets[key]) {
          secretHasBeenSet = true;
        }
      });
      setAPIKeysSet(secretHasBeenSet);
    }
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader
          open={open}
          onClick={toggleDrawer}
          sx={{ justifyContent: open ? 'space-between' : 'flex-end' }}
        >
          {
            <img
              style={{
                marginLeft: open ? '.5em' : '.0em',
                marginTop: '2em',
                height: 16,
                // on hover, show the finger cursor
                cursor: 'pointer',
              }}
              src={open ? MagickLogo : MagickLogoSmall}
              onClick={toggleDrawer}
              alt=""
            />
          }
        </DrawerHeader>
        <List
          sx={{
            padding: 0,
          }}
        >
          <DrawerItem
            active={
              location.pathname.includes('/magick') ||
              location.pathname.includes('/home')
            }
            Icon={AutoFixHighIcon}
            open={open}
            onClick={onClick('/magick')}
            text="Spells"
          />
          <DrawerItem
            active={location.pathname === '/agents'}
            Icon={AppsIcon}
            open={open}
            onClick={onClick('/agents')}
            text="Agents"
          />
          <DrawerItem
            active={location.pathname === '/documents'}
            Icon={DocumentIcon}
            open={open}
            onClick={onClick('/documents')}
            text="Documents"
          />
          <DrawerItem
            active={location.pathname === '/events'}
            Icon={BoltIcon}
            open={open}
            onClick={onClick('/events')}
            text="Events"
          />
          <DrawerItem
            active={location.pathname === '/requests'}
            Icon={StorageIcon}
            open={open}
            onClick={onClick('/requests')}
            text="Requests"
          />
          <PluginDrawerItems onClick={onClick} open={open} />
          <Divider />
          <DrawerItem
            active={location.pathname.includes('/settings')}
            Icon={SettingsIcon}
            open={open}
            onClick={onClick('/settings')}
            text="Settings"
          />
          {!isAPIKeysSet && <SetAPIKeys />}
        </List>
      </StyledDrawer>
      {children}
    </div>
  );
}

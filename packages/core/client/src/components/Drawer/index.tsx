// DOCUMENTED
import { ClientPluginManager, pluginManager } from '@magickml/core'
import AppsIcon from '@mui/icons-material/Apps'
import ArticleIcon from '@mui/icons-material/Article'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import BoltIcon from '@mui/icons-material/Bolt'
import SettingsIcon from '@mui/icons-material/Settings'
import StorageIcon from '@mui/icons-material/Storage'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { CSSObject, Theme, styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ProjectWindowProvider,
  useProjectWindow,
} from '../../contexts/ProjectWindowContext'
import ProjectWindow from './ProjectWindow'
import { SetAPIKeys } from './SetAPIKeys'
import MagickLogo from './logo-full.png'
import MagickLogoSmall from './logo-small.png'
import { Tooltip } from '@mui/material';
import { drawerTooltipText } from "./tooltiptext"
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { SvgIconProps } from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AgentMenu from './AgentMenu'

// Constants
const drawerWidth = 210

// CSS mixins for open and close states
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

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
})

// DrawerHeader component properties
type HeaderProps = {
  open: boolean
  theme?: Theme
}


type StyledTreeItemProps = TreeItemProps & {
  labelIcon: React.ElementType<SvgIconProps>;
  labelText: string;
  iconColor?: string;
};

/**
 * The DrawerHeader component style definition based on its open state property.
 */
const DrawerHeader = styled('div', {
  shouldForwardProp: prop => prop !== 'open',
})<HeaderProps>(({ theme, open }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  left: 3,
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

/**
 * The StyledDrawer component style definition based on its open state property.
 */
const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }: HeaderProps) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme as Theme),
    '& .MuiDrawer-paper': openedMixin(theme as Theme),
  }),
  ...(!open && {
    ...closedMixin(theme as Theme),
    '& .MuiDrawer-paper': closedMixin(theme as Theme),
  }),
}))

// DrawerItem component properties
type DrawerItemProps = {
  Icon: React.ElementType
  open: boolean
  text: string
  tooltip: string
  active: boolean
  onClick?: () => void
  tooltipText: string
}

/**
 * The DrawerItem component used to display individual items in the main drawer.
 */
const DrawerItem: React.FC<DrawerItemProps> = ({
  Icon,
  open,
  text,
  active,
  onClick,
  tooltipText
}) => (
  <ListItem key={text} disablePadding sx={{ display: 'block' }}>
    <Tooltip title={tooltipText} placement="top"
      enterDelay={500}
      arrow
    >

      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 1,
        }}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 2 : 'auto',
            justifyContent: 'center',
            color: active ? 'var(--primary)' : 'white',
          }}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </Tooltip>
  </ListItem>
)

// PluginDrawerItems component properties
type PluginDrawerItemsProps = {
  onClick: (path: string) => () => void
  open: boolean
}

/**
 * The PluginDrawerItems component used to display plugin-related drawer items.
 */
const PluginDrawerItems: React.FC<PluginDrawerItemsProps> = ({
  onClick,
  open,
}) => {
  const location = useLocation()
  const drawerItems = (pluginManager as ClientPluginManager).getDrawerItems()
  let lastPlugin: string | null = null
  let divider = false
  return (
    <>
      {drawerItems.map(item => {
        if (item.plugin !== lastPlugin) {
          divider = false
          lastPlugin = item.plugin
        } else {
          divider = false
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
              tooltip='Avatar and Tasks Tooltip'
              tooltipText={item.tooltip}
            />
          </div>
        )
      })}
    </>
  )
}

type DrawerProps = {
  children: React.ReactNode
}
const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({

  [`& .${treeItemClasses.content}`]: {

    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
      // Remove position and related properties here
      position: 'static',
      top: 'auto',
      left: 'auto',
    },
  },
}));


function StyledTreeItem(props: StyledTreeItemProps) {

  const {
    labelIcon: LabelIcon,
    labelText,
    iconColor,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={LabelIcon} color={iconColor ? iconColor : "#F4CC22"} sx={{ mr: 1 }} />
          <ListItemText primary={labelText}  sx={{  flexGrow: 1 }} />
        </Box>
      }
      {...other}
    />
  );
}


/**
 * The main Drawer component that wraps around the application content.
 */
export function Drawer({ children }: DrawerProps): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const { openProjectWindow, openDrawer, setOpenDrawer, setOpenProjectWindow } =
    useProjectWindow()
  const [isAPIKeysSet, setAPIKeysSet] = useState(false)

  // Function to toggle drawer state
  const toggleDrawer = () => {
    if (!openDrawer) setOpenProjectWindow(false)
    setOpenDrawer(!openDrawer)
  }

  // Function to handle navigation based on location path
  const onClick = (location: string) => () => {
    navigate(location)
  }

  useEffect(() => {
    const secrets = localStorage.getItem('secrets')
    if (secrets) {
      let secretHasBeenSet = false
      const parsedSecrets = JSON.parse(secrets)
      Object.keys(parsedSecrets).forEach(key => {
        if (parsedSecrets[key] !== '' && parsedSecrets[key]) {
          secretHasBeenSet = true
        }
      })
      setAPIKeysSet(secretHasBeenSet)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'b' && event.ctrlKey) {
        setOpenProjectWindow(prevState => !prevState)
        setOpenDrawer(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <StyledDrawer variant="permanent" open={openDrawer}>
        {/* <DrawerHeader
          open={openDrawer}
          onClick={toggleDrawer}
          sx={{ justifyContent: openDrawer ? 'space-between' : 'flex-end' }}
        > */}
          <AgentMenu />
        {/* </DrawerHeader> */}
        <List
          sx={{
            padding: 0,
          }}
        >

          <DrawerItem
            active={location.pathname === '/events'}
            Icon={BoltIcon}
            open={openDrawer}
            onClick={onClick('/events')}
            text="Events"
            tooltip="Events Tooltip"
            tooltipText={drawerTooltipText.events}
          />
          <DrawerItem
            active={location.pathname === '/requests'}
            Icon={StorageIcon}
            open={openDrawer}
            onClick={onClick('/requests')}
            text="Requests"
            tooltip="Requests Tooltip"
            tooltipText={drawerTooltipText.requests}
          />

          <PluginDrawerItems onClick={onClick} open={openDrawer} />

          <DrawerItem
            active={location.pathname.includes('/settings')}
            Icon={SettingsIcon}
            open={openDrawer}
            onClick={onClick('/settings')}
            text="Settings"
            tooltip="Settings Tooltip"
            tooltipText={drawerTooltipText.settings}
          />
          {!isAPIKeysSet && <SetAPIKeys />}
        </List>
        <Divider />
        <TreeView
          aria-label="icon expansion"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, position: 'relative' }}
          // multiSelect
        >
          <StyledTreeItem nodeId="1" labelText="Documents" labelIcon={FolderOpenOutlinedIcon}>
            <StyledTreeItem nodeId="2" labelText="Uploaded books" labelIcon={FolderOpenOutlinedIcon}>
              <StyledTreeItem
                nodeId="3"
                labelText="Promotions.txt"
                labelIcon={DescriptionOutlinedIcon}
                iconColor='#42B951'
              />
              <StyledTreeItem
                nodeId="4"
                labelText="tree-view.js"
                labelIcon={DescriptionOutlinedIcon}
                iconColor='#42B951'
              />
            </StyledTreeItem>
            <StyledTreeItem nodeId="5" labelText="Gematria notes" labelIcon={FolderOpenOutlinedIcon}>
              <StyledTreeItem
                nodeId="6"
                labelText="Promotions"
                labelIcon={DescriptionOutlinedIcon}
                iconColor='#42B951'
              />
              <StyledTreeItem
                nodeId="7"
                labelText="Promotions"
                labelIcon={DescriptionOutlinedIcon}
                iconColor='#42B951'
              />
            </StyledTreeItem>
            <StyledTreeItem nodeId="8" labelText="Journal entires" labelIcon={FolderOpenOutlinedIcon}>
              <StyledTreeItem
                nodeId="9"
                labelText="Promotions"
                labelIcon={DescriptionOutlinedIcon}
                iconColor='#42B951'
              />
              <StyledTreeItem
                nodeId="10"
                labelText="Promotions"
                labelIcon={DescriptionOutlinedIcon}
                iconColor='#42B951'
              />
            </StyledTreeItem>
          </StyledTreeItem>
          <StyledTreeItem nodeId="11" labelText="Spells & Prompts" labelIcon={FolderOpenOutlinedIcon}>
            <StyledTreeItem
              nodeId="12"
              labelText="demo.spell"
              labelIcon={StarBorderPurple500OutlinedIcon}
              iconColor='#1BC5EB'
            />
             <StyledTreeItem
              nodeId="12"
              labelText="classifier.prompt"
              labelIcon={HistoryEduOutlinedIcon}
              iconColor='#9D12A4'
            />
            
          </StyledTreeItem>
        </TreeView>
      </StyledDrawer>
      {openProjectWindow && <ProjectWindow openDrawer={openProjectWindow} />}
      {children}
    </div>
  )
}

export const DrawerProvider = ({ children }: DrawerProps) => {
  return (
    <ProjectWindowProvider>
      <Drawer> {children}</Drawer>
    </ProjectWindowProvider>
  )
}

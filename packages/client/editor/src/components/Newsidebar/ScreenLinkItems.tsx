import List from "@mui/material/List"
import { DrawerItem } from "./DrawerItem"
import { PluginDrawerItems } from "./PluginDrawerItems"
import BoltIcon from '@mui/icons-material/Bolt'
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings'
import StorageIcon from '@mui/icons-material/Storage'
import { useTabLayout } from "@magickml/providers"
import { SetAPIKeys, drawerTooltipText } from "client/core"

export const ScreenLinkItems = ({ isAPIKeysSet, currentTab }) => {
  const { openTab } = useTabLayout()

  return (
    <List
      sx={{
        padding: 0,
      }}
    >
      <DrawerItem
        active={currentTab?.id === 'Events'}
        Icon={BoltIcon}
        onClick={() => {
          openTab({
            name: 'Events',
            type: 'Events',
            switchActive: true,
            id: 'Events',
          })
        }}
        text="Events"
        tooltip="Events Tooltip"
        tooltipText={drawerTooltipText.events}
      />
      <DrawerItem
        active={currentTab?.id === 'Documents'}
        Icon={ArticleIcon}
        onClick={() => {
          openTab({
            name: 'Documents',
            type: 'Documents',
            switchActive: true,
            id: 'Documents',
          })
        }}
        text="Documents"
        tooltip="Documents Tooltip"
        tooltipText={drawerTooltipText.documents}
      />
      <DrawerItem
        active={currentTab?.id === 'Requests'}
        Icon={StorageIcon}
        onClick={() => {
          openTab({
            name: 'Requests',
            type: 'Requests',
            switchActive: true,
            id: 'Requests',
          })
        }}
        text="Requests"
        tooltip="Requests Tooltip"
        tooltipText={drawerTooltipText.requests}
      />

      <PluginDrawerItems currentTab={currentTab} />

      <DrawerItem
        active={currentTab?.id === 'Settings'}
        Icon={SettingsIcon}
        onClick={() => {
          openTab({
            name: 'Settings',
            type: 'Settings',
            switchActive: true,
            id: 'Settings',
          })
        }}
        text="Settings"
        tooltip="Settings Tooltip"
        tooltipText={drawerTooltipText.settings}
      />
      {!isAPIKeysSet && <SetAPIKeys />}
    </List>)
}
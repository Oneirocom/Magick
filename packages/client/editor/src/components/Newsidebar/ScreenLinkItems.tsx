import List from "@mui/material/List"
import { DrawerItem } from "./DrawerItem"
import { PluginDrawerItems } from "./PluginDrawerItems"
import BoltIcon from '@mui/icons-material/Bolt'
import SettingsIcon from '@mui/icons-material/Settings'
import StorageIcon from '@mui/icons-material/Storage'
import { useTabLayout } from "@magickml/providers"
import { SetAPIKeys, drawerTooltipText } from "client/core"

export const ScreenLinkItems = ({ isAPIKeysSet }) => {
  const { openTab } = useTabLayout()

  return (
    <List
      sx={{
        padding: 0,
      }}
    >
      <DrawerItem
        active={location.pathname === '/events'}
        Icon={BoltIcon}
        onClick={() => {
          openTab({
            name: 'Events',
            type: 'Events',
            switchActive: true,
            id: 'events',
          })
        }}
        text="Events"
        tooltip="Events Tooltip"
        tooltipText={drawerTooltipText.events}
      />
      <DrawerItem
        active={location.pathname === '/requests'}
        Icon={StorageIcon}
        onClick={() => {
          openTab({
            name: 'Requests',
            type: 'Requests',
            switchActive: true,
            id: 'requests',
          })
        }}
        text="Requests"
        tooltip="Requests Tooltip"
        tooltipText={drawerTooltipText.requests}
      />

      <PluginDrawerItems />

      <DrawerItem
        active={location.pathname.includes('/settings')}
        Icon={SettingsIcon}
        onClick={() => {
          openTab({
            name: 'Settings',
            type: 'Settings',
            switchActive: true,
            id: 'settings',
          })
        }}
        text="Settings"
        tooltip="Settings Tooltip"
        tooltipText={drawerTooltipText.settings}
      />
      {!isAPIKeysSet && <SetAPIKeys />}
    </List>)
}
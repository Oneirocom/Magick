import List from "@mui/material/List"
import { DrawerItem } from "./DrawerItem"
import { PluginDrawerItems } from "./PluginDrawerItems"
import BoltIcon from '@mui/icons-material/Bolt'
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings'
import StorageIcon from '@mui/icons-material/Storage'
import { useTabLayout } from "@magickml/providers"
import { SetAPIKeys } from "client/core"
import React from "react";
import { ListItem } from "@mui/material";

export const drawerTooltipText = {
  spells: 'Create and manage spell node graphs for agents to use. ',
  agents: 'Create and manage autonomous agents powered by spells. ',
  documents:
    'Information vectorized as embeddings for quick search and retrieval. ',
  events: 'Data stored for use as short-term memory between spell runs.',
  requests: 'Historical outbound requests made to LLM web services. ',
  tasks: 'Objectives for agents to iterate through and complete.',
  avatar: 'Chat with your agents embodied with a 3D avatar.',
  settings: 'Global settings used in the Playtest window.',
  config: 'Configure your agents integrations, data, and more.'
}


type DrawerItem = {
  name: string
  Icon: any
  tooltip: string
  tooltipText: string
}

export const ScreenLinkItems = ({ isAPIKeysSet, currentTab }) => {
  const { openTab } = useTabLayout()

  const DrawerItems: (DrawerItem | React.JSX.Element)[] = [
    {
      name: 'Events',
      Icon: BoltIcon,
      tooltip: 'Events Tooltip',
      tooltipText: drawerTooltipText.events,
    },
    {
      name: 'Documents',
      Icon: ArticleIcon,
      tooltip: 'Documents Tooltip',
      tooltipText: drawerTooltipText.documents,
    },
    {
      name: 'Requests',
      Icon: StorageIcon,
      tooltip: 'Requests Tooltip',
      tooltipText: drawerTooltipText.requests,
    },
    <PluginDrawerItems currentTab={currentTab} />,
    {
      name: 'Config',
      Icon: SettingsIcon,
      tooltip: 'Settings Tooltip',
      tooltipText: drawerTooltipText.settings,
    },
  ]

  return (
    <List sx={{ padding: 0, width: '100%' }}>
      {DrawerItems.map((item, index: {}) => {
        const isElement = React.isValidElement(item);
        const key = isElement ? `plugin-drawer-item-${index}` : (item as DrawerItem).name;

        if (!isElement) {
          const drawerItem = item as DrawerItem;
          return (
            <DrawerItem
              key={key} // Unique key for each DrawerItem
              active={currentTab?.id === drawerItem.name}
              Icon={drawerItem.Icon}
              onClick={() => openTab({
                name: drawerItem.name,
                type: drawerItem.name,
                switchActive: true,
                id: drawerItem.name,
              })}
              text={drawerItem.name}
              tooltip={drawerItem.tooltip}
              tooltipText={drawerItem.tooltipText}
            />
          );
        } else {
          // Directly return the element if it's a JSX element
          return React.cloneElement(item, { key });
        }
      })}
      {!isAPIKeysSet && (
        <ListItem key="set-api-keys" disablePadding sx={{ display: 'block' }}>
          <SetAPIKeys />
        </ListItem>
      )}
    </List>

  )
}

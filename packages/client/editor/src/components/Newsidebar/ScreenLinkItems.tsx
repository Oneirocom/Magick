import List from "@mui/material/List"
import { DrawerItem } from "./DrawerItem"
import { PluginDrawerItems } from "./PluginDrawerItems"
import BoltIcon from '@mui/icons-material/Bolt'
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings'
import StorageIcon from '@mui/icons-material/Storage'
import { useTabLayout } from "@magickml/providers"
import { SetAPIKeys, drawerTooltipText } from "client/core"
import React from "react";

type DrawerItem = {
  name: string
  Icon: any
  tooltip: string
  tooltipText: string
}

export const ScreenLinkItems = ({ isAPIKeysSet, currentTab }) => {
  const { openTab } = useTabLayout()

  const DrawerItems: (DrawerItem | JSX.Element)[] = [
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
      name: 'Settings',
      Icon: SettingsIcon,
      tooltip: 'Settings Tooltip',
      tooltipText: drawerTooltipText.settings,
    },
  ]

  return (
    <List
      sx={{
        padding: 0,
      }}
    >
      {DrawerItems.map((_item, index) => {
        // check that item is not a react element object
        if (typeof _item === 'object' && !React.isValidElement(_item)) {
          const item = _item as DrawerItem

          return (
            <DrawerItem
              active={currentTab?.id === item.name}
              Icon={item.Icon}
              onClick={() => {
                openTab({
                  name: item.name,
                  type: item.name,
                  switchActive: true,
                  id: item.name,
                })
              }}
              text={item.name}
              tooltip={item.tooltip}
              tooltipText={item.tooltipText}
            />
          )
        } else {
          console.log('ITEM!!')
          return _item as JSX.Element
        }
      })}
      {!isAPIKeysSet && <SetAPIKeys />}
    </List>)
}
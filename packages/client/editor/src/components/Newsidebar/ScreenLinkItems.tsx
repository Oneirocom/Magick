import List from "@mui/material/List"
import { DrawerItem } from "./DrawerItem"
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings'
import SecretsIcon from '@mui/icons-material/Password'
import StorageIcon from '@mui/icons-material/Storage'
import { useTabLayout } from "@magickml/providers"
import React from "react";
import { RootState, useGetAgentByIdQuery } from "client/state";
import { useSelector } from "react-redux";

export const drawerTooltipText = {
  spells: 'Create and manage spell node graphs for agents to use. ',
  agents: 'Create and manage autonomous agents powered by spells. ',
  knowledge: 'Manage knowledge for your agent',
  documents:
    'Information vectorized as embeddings for quick search and retrieval. ',
  events: 'Data stored for use as short-term memory between spell runs.',
  requests: 'Historical outbound requests made to LLM web services. ',
  tasks: 'Objectives for agents to iterate through and complete.',
  avatar: 'Chat with your agents embodied with a 3D avatar.',
  settings: 'Global settings used in the Playtest window.',
  config: 'Configure your agents integrations, data, and more.',
  secrets: 'Manage your secrets',
}


type DrawerItem = {
  name: string
  Icon: any
  tooltip: string
  tooltipText: string
  isV1?: boolean
  isV2?: boolean
}

export const ScreenLinkItems = ({ isAPIKeysSet, currentTab }) => {
  const { openTab } = useTabLayout()
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig

  const { data: agent, isLoading } = useGetAgentByIdQuery({ agentId: currentAgentId }, { skip: !currentAgentId })

  if (isLoading) {
    return null
  }

  const isV2 = agent?.version === '2.0'

  const DrawerItems: (DrawerItem | React.JSX.Element)[] = [
    // todo remake this events page
    // {
    //   name: 'Events',
    //   Icon: BoltIcon,
    //   tooltip: 'Events Tooltip',
    //   tooltipText: drawerTooltipText.events,
    // },
    {
      name: 'Documents',
      Icon: ArticleIcon,
      isV1: true,
      tooltip: 'Documents Tooltip',
      tooltipText: drawerTooltipText.documents,
    },
    {
      name: 'Knowledge',
      Icon: ArticleIcon,
      isV2: true,
      tooltip: 'Knowledge Tooltip',
      tooltipText: drawerTooltipText.documents,
    },
    {
      name: 'Requests',
      Icon: StorageIcon,
      tooltip: 'Requests Tooltip',
      tooltipText: drawerTooltipText.requests,
    },
    {
      name: 'Config',
      Icon: SettingsIcon,
      tooltip: 'Settings Tooltip',
      tooltipText: drawerTooltipText.settings,
    },
    {
      name: 'Secrets',
      Icon: SecretsIcon,
      tooltip: 'Secrets Tooltip',
      tooltipText: drawerTooltipText.secrets,
    }
  ]

  return (
    <List sx={{ padding: 0, width: '100%' }}>
      {DrawerItems
        .map((item, index: {}) => {
          const isElement = React.isValidElement(item);
          const key = isElement ? `plugin-drawer-item-${index}` : (item as DrawerItem).name;

          if (!isElement) {
            const drawerItem = item as DrawerItem;

            if (drawerItem.isV1 && isV2) {
              return null;
            }

            if (drawerItem.isV2 && !isV2) {
              return null;
            }

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
    </List>

  )
}

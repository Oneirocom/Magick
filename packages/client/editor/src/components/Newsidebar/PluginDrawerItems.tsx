
import { ClientPluginManager, pluginManager } from 'shared/core'
import { useTabLayout } from '@magickml/providers'
import Divider from '@mui/material/Divider'
import { DrawerItem } from './DrawerItem'
import { Tab } from 'client/state'
// PluginDrawerItems component properties
type PluginDrawerItemsProps = {
  currentTab: Tab
}

/**
 * The PluginDrawerItems component used to display plugin-related drawer items.
 */
export const PluginDrawerItems: React.FC<PluginDrawerItemsProps> = ({ currentTab }) => {
  const { openTab } = useTabLayout()
  const drawerItems = (pluginManager as ClientPluginManager).getDrawerItems()
  let lastPlugin: string | null = null
  let divider = false
  return drawerItems.map(item => {
    if (item.plugin !== lastPlugin) {
      divider = false
      lastPlugin = item.plugin
    } else {
      divider = false
    }
    return (
      <DrawerItem
        key={item.path}
        active={currentTab?.id === item.text}
        Icon={item.icon}

        onClick={() => {
          openTab({
            name: item.text,
            type: item.text,
            switchActive: true,
            id: item.text,
          })
        }}
        text={item.text}
        tooltip="Avatar and Tasks Tooltip"
        tooltipText={item.tooltip}
      />
    )
  })
}
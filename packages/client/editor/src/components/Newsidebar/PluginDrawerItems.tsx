
import { ClientPluginManager, pluginManager } from 'shared/core'
import { useTabLayout } from '@magickml/providers'
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
  return drawerItems.map(item => {
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

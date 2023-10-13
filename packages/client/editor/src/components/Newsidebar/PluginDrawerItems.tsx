
import { ClientPluginManager, pluginManager } from 'shared/core'
import { useTabLayout } from '@magickml/providers'
import { useLocation } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import { DrawerItem } from './DrawerItem'
import { Panel } from 'client/state'
// PluginDrawerItems component properties
type PluginDrawerItemsProps = {
  currentTab: Panel
}

/**
 * The PluginDrawerItems component used to display plugin-related drawer items.
 */
export const PluginDrawerItems: React.FC<PluginDrawerItemsProps> = ({ currentTab }) => {
  const { openTab } = useTabLayout()
  const location = useLocation()
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
      <div key={item.path}>
        {divider && <Divider />}
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
      </div>
    )
  })
}
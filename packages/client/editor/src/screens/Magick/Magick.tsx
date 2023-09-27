// DOCUMENTED
import { LoadingScreen, TabLayout, usePubSub } from 'client/core'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TabBar from '../../components/TabBar/TabBar'
import Workspaces from '../../components/Workspaces'

import { ClientPluginManager, pluginManager } from 'shared/core'
import {
  RootState,
  activeTabIdSelector,
  activeTabSelector,
  changeActive,
  openTab,
  selectAllTabs,
} from 'client/state'
/**
 * Magick component
 * @param empty flag to control whether the workspaces should be rendered or not
 * @returns JSX.Element
 */

const Magick = ({ empty = false }): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { subscribe, events } = usePubSub()
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const activeTabId = useSelector(activeTabIdSelector)
  const activeTab = useSelector(activeTabSelector)
  const pubSub = usePubSub()
  const pluginComponents = []

  ;(pluginManager as ClientPluginManager)
    .getGroupedClientRoutes()
    .forEach(plugin => {
      plugin.routes.map(route => {
        pluginComponents.push({
          name: route.path.charAt(1).toUpperCase() + route.path.slice(2),
          component: route.component,
        })
      })
    })

  // Subscribe to open tab events
  useEffect(() => {
    if (!subscribe || !events || !dispatch) return
    return subscribe(events.OPEN_TAB, (_event, tabData) => {
      dispatch(openTab(tabData))
    }) as () => void
  }, [subscribe, events.OPEN_TAB, dispatch])

  // Handle what we do if there are no tabs
  useEffect(() => {
    if (tabs.length === 0 && !activeTabId) navigate('/home')

    // Handle what we do if there are tabs but no active tab
    if (tabs.length > 0 && !activeTabId) {
      const firstTab = tabs[0]
      dispatch(changeActive(firstTab.id))
    }
  }, [tabs, activeTabId, navigate])

  // Render loading screen if there's no active tab
  if (!activeTabId) return <LoadingScreen />

  return (
    <>
      <TabBar tabs={tabs} activeTabId={activeTabId} />
      <TabLayout>
        {!empty && (
          <Workspaces tabs={tabs} pubSub={pubSub} activeTabId={activeTabId} />
        )}
      </TabLayout>
    </>
  )
}

Magick.whyDidYouRender = true

export default Magick

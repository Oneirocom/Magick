// DOCUMENTED
import { LoadingScreen, TabLayout, usePubSub } from '@magickml/client-core'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import TabBar from '../../components/TabBar/TabBar'
import Workspaces from '../../components/Workspaces'
import Events from '../EventWindow'
import Requests from '../RequestWindow'
import Settings from '../settings/SettingsWindow'
import Documents from '../DocumentWindow'
import Agents from '../agents/AgentManagerWindow';
import { ClientPluginManager, pluginManager } from '@magickml/core'
import { RootState, activeTabSelector, closeTab, openTab, selectAllTabs } from '@magickml/state'
/**
 * Magick component
 * @param empty flag to control whether the workspaces should be rendered or not
 * @returns JSX.Element
 */

const Magick = ({ empty = false }): JSX.Element => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const activeTab = useSelector(activeTabSelector)
  const pubSub = usePubSub()
  const { URI } = useParams()
  const { events, subscribe } = pubSub

  const pluginComponents = []

    ; (pluginManager as ClientPluginManager)
      .getGroupedClientRoutes()
      .forEach(plugin => {
        plugin.routes.map(route => {
          pluginComponents.push({
            name: route.path.charAt(1).toUpperCase() + route.path.slice(2),
            component: route.component,
          })
        })
      })

  const componentMapping = {
    Events,
    Requests,
    Settings,
    Documents,
    Agents,
    ...pluginComponents.reduce((acc, obj) => {
      acc[obj.name] = obj.component
      return acc
    }, {}),
  }

  // Subscribe to open tab events
  useEffect(() => {
    return subscribe(events.OPEN_TAB, (_event, tabData) => {
      dispatch(openTab(tabData))
    }) as () => void
  }, [subscribe, events.OPEN_TAB, dispatch])

  // Handle tabs and navigation
  useEffect(() => {
    // If there are still tabs, grab one at random to open to for now.
    // We should do better at this.  Probably with some kind of tab ordering.
    // Could fit in well with drag and drop for tabs
    if (tabs.length > 0 && !activeTab) {
      navigate(`/magick/${tabs[Math.floor(Math.random() * tabs.length)].URI}`)
    }

    if (tabs.length === 0 && !activeTab && !URI) navigate('/home')
  }, [tabs, activeTab, URI, navigate])

  // Handle URI changes
  useEffect(() => {
    if (!URI) return
    // Return if navigating to the spell that is already active
    if (activeTab && URI.includes(activeTab.URI.split('%')[0])) return

    // Close spell tab if it exists
    const spellNameTab = tabs.filter(tab => tab.URI === URI)
    const isSpellNameTabPresent = spellNameTab.length
    if (isSpellNameTabPresent) dispatch(closeTab(spellNameTab[0].id))
    const Component = URI.split('-')[0]
    if (URI && Component in componentMapping) {
      const existingTab = tabs.find(tab => tab.URI === URI)
      if (!existingTab) {
        dispatch(
          openTab({
            name: Component,
            componentType: Component, // Set the componentType as the URI for now, you can modify this as needed
            openNew: false,
            type: 'component',
          })
        )
      }
    } else {
      dispatch(
        openTab({
          name: URI,
          openNew: false,
          type: 'spell',
        })
      )
    }
  }, [URI, activeTab, tabs, dispatch])

  // Render loading screen if there's no active tab
  if (!activeTab) return <LoadingScreen />

  const ComponentToRender = componentMapping[activeTab.componentType] || null

  return (
    <>
      <TabBar tabs={tabs} activeTab={activeTab} />
      <TabLayout>
        {!empty && (
          <>
            {ComponentToRender ? (
              <ComponentToRender /> // Render the dynamically opened component if available
            ) : (
              <Workspaces tabs={tabs} pubSub={pubSub} activeTab={activeTab} />
            )}
          </>
        )}
      </TabLayout>
    </>
  )
}

Magick.whyDidYouRender = true

export default Magick

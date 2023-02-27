import { RootState } from '../../state/store'
import {
  activeTabSelector,
  selectAllTabs,
  openTab,
  closeTab,
} from '../../state/tabs'
import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { usePubSub } from '../../contexts/PubSubProvider'
import { LoadingScreen, TabLayout } from '@magickml/client-core'
import Workspaces from '../../workspaces'

import TabBar from '../../components/TabBar/TabBar'

const Magick = ({ empty = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const activeTab = useSelector(activeTabSelector)

  const pubSub = usePubSub()
  const { URI } = useParams()
  const { events, publish, subscribe } = pubSub

  // Handle open tab events
  useEffect(() => {
    return subscribe(events.OPEN_TAB, (_event, tabData) => {
      
      dispatch(openTab(tabData))
    }) as () => void
  })

  useEffect(() => {
    if (!tabs) return

    // If there are still tabs, grab one at random to open to for now.
    // We should do better at this.  Probably with some kind of tab ordering.
    // Could fit in well with drag and drop for tabs
    if (tabs.length > 0 && !activeTab && !URI) {
      navigate(`/magick/${tabs[0].URI}`)
    }

    if (tabs.length === 0 && !activeTab && !URI) navigate('/home')
  }, [tabs])

  useEffect(() => {
    if (!URI) return

    // Return if navigating to the spell that is already active
    if (activeTab && activeTab.URI === URI) return
    // Close spell tab if it is exists
    let spellNameTab = tabs.filter(tab => tab.URI === URI)
    let isSpellNameTabPresent = spellNameTab.length
    if (isSpellNameTabPresent) dispatch(closeTab(spellNameTab[0].id))

    dispatch(
      openTab({
        name: URI,
        openNew: false,
        type: 'spell',
      })
    )
  }, [URI])

  useHotkeys(
    'Control+z',
    () => {
      if (!pubSub || !activeTab) return

      publish(events.$UNDO(activeTab.id))
    },
    [pubSub, activeTab]
  )

  useHotkeys(
    'Control+Shift+z',
    () => {
      if (!pubSub || !activeTab) return
      publish(events.$REDO(activeTab.id))
    },
    [pubSub, activeTab]
  )

  useHotkeys(
    'Control+Delete',
    () => {
      if (!pubSub || !activeTab) return
      publish(events.$DELETE(activeTab.id))
    },
    [pubSub, activeTab]
  )

  if (!activeTab) return <LoadingScreen />

  

  return (
    <>
      <TabBar tabs={tabs} activeTab={activeTab} />
      <TabLayout>
        {!empty && (
          <Workspaces tabs={tabs} pubSub={pubSub} activeTab={activeTab} />
        )}
      </TabLayout>
    </>
  )
}

export default Magick

import { RootState } from '../../state/store'
import {
  activeTabSelector,
  selectAllTabs,
  openTab,
  closeTab,
} from '../../state/tabs'
import { useEffect } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { usePubSub } from '../../contexts/PubSubProvider'
import { LoadingScreen, TabLayout } from '@magickml/client-core'
import Workspaces from '../../workspaces'
import TabBar from '../../components/TabBar/TabBar'
import axios from 'axios'


const Magick = ({ empty = false }) => {
  const config = useConfig()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
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
    //Check If exists
    if (activeTab) {
      //If No spell Exist on Project id
      axios.get(config.apiUrl+'/spells', {
        params: {
          projectId: config.projectId
        }
      }).then(function (response) {
        if (response.data.total == 0){
          navigate('/home')
        }
      })
      //Check on Page load if the spell exsists
      //Redux Query gives undefined
      axios.get(config.apiUrl+'/spells', {
        params: {
          id: activeTab.id
        }
      })
      .then(function (response) {
        if (response.data.total == 0){
          dispatch(closeTab(activeTab.id))
          
          let temp_tabs = tabs.filter((item) => item.id !== activeTab.id)
          console.log(temp_tabs)
          if (temp_tabs.length === 0) navigate('/home')
          let idx = Math.floor(Math.random() * temp_tabs.length)
          if (temp_tabs.length > 0) navigate(`/magick/${temp_tabs[idx].URI}`)
          dispatch(
            openTab({
              name: temp_tabs[idx].URI,
              openNew: false,
              type: 'spell',
            })
          )
          enqueueSnackbar('You are trying to access spell, that no longer exists ', {
            variant: 'error',
          })
          
        }
      })
    }
    // If there are still tabs, grab one at random to open to for now.
    // We should do better at this.  Probably with some kind of tab ordering.
    // Could fit in well with drag and drop for tabs
    if (tabs.length > 0 && !activeTab) {
      navigate(`/magick/${tabs[Math.floor(Math.random() * tabs.length)].URI}`)
    }
    
    if (tabs.length === 0 && !activeTab && !URI) navigate('/home')
  }, [tabs])

  useEffect(() => {
    if (!URI) return
    // Return if navigating to the spell that is already active
    if (activeTab && activeTab.URI === URI) return
    // Close spell tab if it is exists
    const spellNameTab = tabs.filter(tab => tab.URI === URI)
    const isSpellNameTabPresent = spellNameTab.length
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

  useHotkeys(
    'Control+c',
    () => {
      if (!pubSub || !activeTab) return
      publish(events.$MULTI_SELECT_COPY(activeTab.id))
    },
    [pubSub, activeTab]
  )

  useHotkeys(
    'Control+v',
    () => {
      if (!pubSub || !activeTab) return
      publish(events.$MULTI_SELECT_PASTE(activeTab.id))
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

import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import {
  useGetSpellsQuery,
  useDeleteSpellMutation,
  useNewSpellMutation,
} from '../../state/api/spells'
import AllProjects from './screens/AllProjects'
import CreateNew from './screens/CreateNew'
import OpenProject from './screens/OpenProject'
import css from './homeScreen.module.css'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'
import { closeTab, openTab, selectAllTabs } from '@/state/tabs'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { useAuth } from '@/contexts/AuthProvider'

//MAIN

const StartScreen = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const { user } = useAuth()
  const [deleteSpell] = useDeleteSpellMutation()
  const { data: spells } = useGetSpellsQuery(user?.id as string)
  const [newSpell] = useNewSpellMutation()

  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))

  const onReaderLoad = async event => {
    const spellData = JSON.parse(event.target.result)
    /* This part deletes the graph key from the spelldata, which causes the spell to not be imported  */
    /* if (spellData.graph) {
      spellData.graph = spellData.graph
      delete spellData.graph
    } */
    // TODO check for proper values here and throw errors

    // Create new spell
    await newSpell({
      graph: spellData.graph,
      name: spellData.name,
      gameState: spellData.gameState,
      user: user?.id,
    })

    dispatch(
      openTab({
        name: spellData.name,
        spellId: spellData.name,
        type: 'spell',
      })
    )

    navigate('/thoth')
  }

  const loadFile = selectedFile => {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(selectedFile)
  }

  const onDelete = async spellId => {
    try {
      await deleteSpell({ spellId, userId: user?.id as string })
      const [tab] = tabs.filter(tab => tab.spellId === spellId)
      dispatch(closeTab(tab.id))
    } catch (err) {
      console.log('Error deleting spell', err)
    }
  }

  const openSpell = async spell => {
    // dispatch(openTab({ name: spell.name, spellId: spell.name, type: 'spell' }))
    navigate(`/thoth/${spell.name}`)
  }

  const [selectedSpell, setSelectedSpell] = useState(null)

  if (!spells) return <LoadingScreen />

  return (
    <div className={css['overlay']}>
      <div className={css['center-container']}>
        <Routes>
          <Route
            path=""
            element={
              <OpenProject
                spells={spells}
                openSpell={openSpell}
                selectedSpell={selectedSpell}
                setSelectedSpell={setSelectedSpell}
                loadFile={loadFile}
              />
            }
          />
          <Route
            path="all-projects"
            element={
              <AllProjects
                spells={spells}
                openSpell={openSpell}
                selectedSpell={selectedSpell}
                setSelectedSpell={setSelectedSpell}
                loadFile={loadFile}
                onDelete={onDelete}
              />
            }
          />
          <Route path="create-new" element={<CreateNew />} />
        </Routes>
      </div>
    </div>
  )
}

export default StartScreen

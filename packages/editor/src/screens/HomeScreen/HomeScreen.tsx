import { LoadingScreen } from '@magickml/client-core'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { useConfig } from '../../contexts/ConfigProvider'
import {
  useDeleteSpellMutation,
  useGetSpellsQuery,
  useNewSpellMutation,
} from '../../state/api/spells'
import { RootState } from '../../state/store'
import { closeTab, openTab, selectAllTabs } from '../../state/tabs'
import AllProjects from './AllProjects'
import CreateNew from './CreateNew'
import css from './homeScreen.module.css'
import OpenProject from './OpenProject'

//MAIN

const StartScreen = () => {
  const config = useConfig()

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const [deleteSpell] = useDeleteSpellMutation()
  const { data: spells } = useGetSpellsQuery({
    projectId: config.projectId,
  })
  const [newSpell] = useNewSpellMutation()

  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))

  const onReaderLoad = async event => {
    // check if file is a

    const spellData = JSON.parse(event.target.result)
    /* This part deletes the graph key from the spelldata, which causes the spell to not be imported  */
    /* if (spellData.graph) {
      spellData.graph = spellData.graph
      delete spellData.graph
    } */
    // TODO check for proper values here and throw errors

    // Create new spell
    const response = (await newSpell({
      graph: spellData.graph,
      name: spellData.name,
      projectId: config.projectId,
      hash: spellData.hash,
    })) as any

    // handle error Property 'data' does not exist on type error
    if (response.error) {
      console.error('Error creating spell', response.error)
      return
    }

    dispatch(
      openTab({
        name:
          response.data.id + '-' + encodeURIComponent(btoa(response.data.name)),
        type: 'spell',
      })
    )

    navigate('/magick')
  }
  const loadFile = selectedFile => {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(selectedFile)
  }

  const onDelete = async spellName => {
    try {
      await deleteSpell({ spellName, projectId: config.projectId })
      const [tab] = tabs.filter(tab => tab.URI === spellName)
      if (tab) {
        dispatch(closeTab(tab.id))
      }
    } catch (err) {
      console.error('Error deleting spell', err)
    }
  }

  const openSpell = async spell => {
    // dispatch(openTab({ name: spell.name, spellName: spell.name, type: 'spell' }))
    navigate(`/magick/${spell.id}-${encodeURIComponent(btoa(spell.name))}`)
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

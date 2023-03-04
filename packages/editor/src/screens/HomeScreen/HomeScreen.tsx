import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { getSpellApi } from '../../state/api/spells'
import AllProjects from './screens/AllProjects'
import CreateNew from './screens/CreateNew'
import OpenProject from './screens/OpenProject'
import css from './homeScreen.module.css'
import { LoadingScreen } from '@magickml/client-core'
import { closeTab, openTab, selectAllTabs } from '../../state/tabs'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../state/store'

import { useConfig } from '../../contexts/ConfigProvider'

//MAIN

const StartScreen = () => {
  const config = useConfig()
  const spellApi = getSpellApi(config)

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const [deleteSpell] = spellApi.useDeleteSpellMutation()
  const { data: spells } = spellApi.useGetSpellsQuery({projectId: config.projectId})
  const [newSpell] = spellApi.useNewSpellMutation()

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
    const response = await newSpell({
      graph: spellData.graph,
      name: spellData.name,
      projectId: config.projectId,
      hash: spellData.hash
    })

    dispatch(
      openTab({
        name: response.data.id +"-"+ encodeURIComponent(btoa(response.data.name)),
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

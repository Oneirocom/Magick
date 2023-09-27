// DOCUMENTED
import { LoadingScreen } from 'client/core'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useConfig, useTreeData } from '@magickml/providers'
import AllProjects from './AllProjects'
import CreateNew from './CreateNew'
import css from './homeScreen.module.css'
import OpenProject from './OpenProject'
import { v4 as uuidv4 } from 'uuid'
import {
  RootState,
  closeTab,
  openTab,
  selectAllTabs,
  useDeleteSpellMutation,
  useGetSpellsQuery,
  useNewSpellMutation,
} from 'client/state'

/**
 * StartScreen component. Displays an overlay with options to open or create new spells.
 * @returns JSX.Element - StartScreen component
 */
const StartScreen = (): JSX.Element => {
  const config = useConfig()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [deleteSpell] = useDeleteSpellMutation()
  const { data: spells } = useGetSpellsQuery({
    projectId: config.projectId,
  })
  const [newSpell] = useNewSpellMutation()
  const { setIsAdded, setToDelete } = useTreeData()
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))

  /**
   * Handles loading a selected file for opening a spell.
   * @param event - FileReader onload event
   */
  const onReaderLoad = async (event): Promise<void> => {
    const spellData = JSON.parse(event.target.result)

    // Create new spell
    const response = (await newSpell({
      id: uuidv4(),
      graph: spellData.graph,
      name: spellData.name,
      projectId: config.projectId,
      hash: spellData.hash,
    })) as any

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

  /**
   * Load a selected file
   * @param selectedFile - File to load
   */
  const loadFile = (selectedFile): void => {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(selectedFile)
  }

  /**
   * Handles spell deletion.
   * @param spellName - The name of the spell to delete
   */
  const onDelete = async (spellName: string): Promise<void> => {
    try {
      await deleteSpell({ spellName, projectId: config.projectId })
      setIsAdded(true)
      // TODO fix this typing
      // @ts-ignore
      setToDelete(spellName)
      const tab = tabs.find(tab => tab.id === spellName)
      if (tab) {
        dispatch(closeTab(tab.id))
        window.localStorage.removeItem(`zoomValues-${tab.id}`)
      }
      setSelectedSpell('')
    } catch (err) {
      console.error('Error deleting spell', err)
    }
  }

  /**
   * Opens a spell
   * @param spell - The spell to be opened
   */
  const openSpell = async (spell): Promise<void> => {
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

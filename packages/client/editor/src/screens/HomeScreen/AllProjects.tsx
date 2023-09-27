// DOCUMENTED
import React, { useEffect, useState } from 'react'
import { Button, Icon, Panel } from 'client/core'
import { Scrollbars } from 'react-custom-scrollbars-2'
import FileInput from '../../components/FileInput'
import ProjectRow from '../../components/ProjectRow'
import css from './homeScreen.module.css'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { SpellInterface } from '@magickml/core'

/**
 * @description AllProjects component props
 */
interface AllProjectsProps {
  /** An object containing spell data */
  spells: {
    /** An array of spell data */
    data: Array<{ name: string }>
  }
  /** Function to open a spell */
  openSpell: (selectedSpell: any) => void
  /** Function to delete a spell */
  onDelete: (selectedSpell: any) => void
  /** Function to set the selected spell */
  setSelectedSpell: (selectedSpell: any) => void
  /** The currently selected spell */
  selectedSpell: any
  /** Function to load file from local filesystem */
  loadFile: (file: any) => void
}

/**
 * @description AllProjects component
 * @param {AllProjectsProps} props - Component props
 * @returns {JSX.Element} AllProjects component JSX.Element
 */
const AllProjects: React.FC<AllProjectsProps> = ({
  spells,
  openSpell,
  onDelete,
  setSelectedSpell,
  selectedSpell,
  loadFile,
}: AllProjectsProps): JSX.Element => {
  const [searchInput, setSearchInput] = useState<string>('')

  /**
   * @description Click handler for import button
   */
  useEffect(() => {
    if (document.location.href.includes('import')) {
      const importButton = document.getElementById('import')
      importButton?.click()
    }
  }, [])

  const navigate = useNavigate()
  return (
    <Panel shadow>
      <div className={css.searchContainer}>
        <h1>
          <Icon
            name={'properties'}
            size={'var(--medium)'}
            style={{ marginRight: 'var(--extraSmall)', top: '3px' }}
          />
          Spellbook
        </h1>
        <input
          type="text"
          value={searchInput}
          onChange={e => {
            setSearchInput(e.target.value)
          }}
          placeholder="Search spell..."
          className={css.search}
        />
        <IconButton
          className={css.searchIcon}
          type="button"
          sx={{ p: '10px' }}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </div>
      <Panel
        style={{
          width: 'var(--c62)',
          height: 'var(--c40)',
          backgroundColor: 'var(--dark-1)',
        }}
        flexColumn
        gap={'var(--small)'}
        roundness="round"
        unpadded
      >
        <Scrollbars>
          {spells.data &&
            // spells.data is an [object Array] but we need to sort it as a [string Array]
            spells.data
              .slice()
              .filter(spell => spell.name !== 'default')
              .sort((a, b) => {
                if (a.name < b.name) {
                  return -1
                }
                if (a.name > b.name) {
                  return 1
                }
                return 0
              })
              .filter(el => el.name.includes(searchInput))
              .map((spell, i) => (
                <ProjectRow
                  key={i}
                  spell={spell as SpellInterface}
                  selectedSpell={selectedSpell}
                  label={spell.name}
                  onDelete={onDelete}
                  onClick={() => {
                    setSelectedSpell(spell)
                  }}
                />
              ))}
        </Scrollbars>
      </Panel>
      <div className={css['button-row']}>
        <Button
          onClick={() => {
            navigate('/magick')
          }}
        >
          back
        </Button>
        <FileInput loadFile={loadFile} />
        <Button
          onClick={() => {
            // console.log('selectedSpell', selectedSpell)
            openSpell(selectedSpell)
          }}
          className={!selectedSpell ? 'disabled' : 'primary'}
        >
          OPEN
        </Button>
      </div>
    </Panel>
  )
}

export default AllProjects

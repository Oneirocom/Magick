// DOCUMENTED
import React, { useEffect } from 'react'
import { Button, Icon, Panel } from '@magickml/client-core'
import { Scrollbars } from 'react-custom-scrollbars-2'
import FileInput from '../../components/FileInput'
import ProjectRow from '../../components/ProjectRow'
import css from './homeScreen.module.css'

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
  /**
   * @description Click handler for import button
   */
  useEffect(() => {
    if (document.location.href.includes('import')) {
      const importButton = document.getElementById('import')
      importButton?.click()
    }
  }, [])

  return (
    <Panel shadow>
      <h1>
        <Icon
          name={'properties'}
          size={'var(--medium)'}
          style={{ marginRight: 'var(--extraSmall)', top: '3px' }}
        />
        Spellbook
      </h1>
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
              .map((spell, i) => (
                <ProjectRow
                  key={i}
                  spell={spell}
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
            window.history.back()
          }}
        >
          back
        </Button>
        <FileInput loadFile={loadFile} />
        <Button
          onClick={() => {
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

import { Scrollbars } from 'react-custom-scrollbars-2'

import Icon from '../../../components/Icon/Icon'
import Panel from '../../../components/Panel/Panel'
import css from '../homeScreen.module.css'
import FileInput from '../components/FileInput'
import ProjectRow from '../components/ProjectRow'

const AllProjects = ({
  spells,
  openSpell,
  onDelete,
  setSelectedSpell,
  selectedSpell,
  loadFile,
}) => {
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
          {spells.map((spell, i) => (
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
        <button
          onClick={() => {
            window.history.back()
          }}
        >
          back
        </button>
        <FileInput loadFile={loadFile} />
        <button
          onClick={() => {
            openSpell(selectedSpell)
          }}
          className={!selectedSpell ? 'disabled' : 'primary'}
        >
          OPEN
        </button>
      </div>
    </Panel>
  )
}

export default AllProjects

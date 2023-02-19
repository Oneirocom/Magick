import { useNavigate } from 'react-router-dom'

import thothBanner from '../version-banner-0.2.0-alpha.png'
import Icon from '../../../components/Icon/Icon'
import Panel from '../../../components/Panel/Panel'
import css from '../homeScreen.module.css'
import FileInput from '../components/FileInput'
import ProjectRow from '../components/ProjectRow'
import { useSelector } from 'react-redux'
import { selectAllTabs } from '../../../state/tabs'
import { RootState } from '../../../state/store'

import packageJson from '../../../../package.json'
const version = packageJson.version

const getMagickVersion = () => version

const OpenProject = ({
  spells,
  setSelectedSpell,
  selectedSpell,
  loadFile,
  openSpell,
}) => {
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const navigate = useNavigate()

  return (
    <Panel shadow unpadded>
      {tabs?.length < 1 && (
        <div
          className={css['version-banner']}
          style={{ backgroundImage: `url(${thothBanner})` }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ float: 'right' }}>{getMagickVersion()}</span>
            <span>&copy; 2023 Oneirocom Systems Inc.</span>
          </div>
        </div>
      )}
      <div className={css['open-project-container']}>
        <h1 style={{ marginLeft: 'var(--small)' }}>Recent Spells</h1>

        <Panel
          style={{ width: 'var(--c62)', backgroundColor: 'var(--dark-1)' }}
          flexColumn
          gap={'var(--small)'}
          roundness="round"
          unpadded
        >
          {spells.data.slice(0, 2).map((spell, i) => {
            return (
              <ProjectRow
                key={i}
                selectedSpell={selectedSpell}
                label={spell.name}
                spell={spell}
                onClick={() => {
                  setSelectedSpell(spell)
                }}
              />
            )
          })}
          <ProjectRow
            key="more"
            label={'More...'}
            icon={'properties'}
            style={{ fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}
            onClick={() => {
              navigate('/home/all-projects')
            }}
          />
        </Panel>

        <div className={css['button-row']}>
          {tabs?.length > 0 && (
            <button
              onClick={() => {
                window.history.back()
              }}
            >
              cancel
            </button>
          )}
          {tabs?.length < 1 && (
            <button
              onClick={() => {
                navigate('/home/create-new')
              }}
            >
              <Icon name="add" style={{ marginRight: 'var(--extraSmall)' }} />
              Create new
            </button>
          )}
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
      </div>
    </Panel>
  )
}

export default OpenProject

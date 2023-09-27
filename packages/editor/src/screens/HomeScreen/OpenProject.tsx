// DOCUMENTED
import { Button, Icon, Panel } from '@magickml/client-core'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import packageJson from '../../../package.json'
import FileInput from '../../components/FileInput'
import ProjectRow from '../../components/ProjectRow'
import css from './homeScreen.module.css'
import banner from './banner.png'
import { RootState, selectAllTabs } from 'client/state'

const version = packageJson.version

/**
 * Get the Magick version from package.json
 * @returns {string} The version string
 */
const getMagickVersion = () => version

/**
 * A component for opening a project
 * @param {Object} props - The component properties
 * @param {Array}  props.spells - The array of spells available
 * @param {Function}   props.setSelectedSpell - Function to set the selected spell
 * @param {Object} props.selectedSpell - The currently selected spell object
 * @param {Function}   props.loadFile - Function to load a file
 * @param {Function}   props.openSpell - Function to open a selected spell
 */
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
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ float: 'right' }}>{getMagickVersion()}</span>
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
            style={{ fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}
            onClick={() => {
              navigate('/home/all-projects')
            }}
          />
        </Panel>

        <div className={css['button-row-open']}>
          {tabs?.length > 0 && (
            <Button
              onClick={() => {
                window.history.back()
              }}
            >
              cancel
            </Button>
          )}
          {tabs?.length < 1 && (
            <Button
              onClick={() => {
                navigate('/home/create-new')
              }}
            >
              <Icon
                name="add"
                size={16}
                style={{ marginRight: 'var(--extraSmall)' }}
              />
              Create new
            </Button>
          )}
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
      </div>
    </Panel>
  )
}

export default OpenProject

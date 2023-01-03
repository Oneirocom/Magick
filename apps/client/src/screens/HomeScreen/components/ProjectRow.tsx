import { Spell } from '@thothai/core'
import { CSSProperties } from 'react'
import Icon from '../../../components/Icon/Icon'
import css from '../homeScreen.module.css'

type ProjectProps = {
  label: string
  selectedSpell?: Spell
  icon?: string
  onClick: Function
  spell?: Spell
  style?: CSSProperties
  onDelete?: Function
}

const ProjectRow = ({
  label,
  selectedSpell,
  onClick = () => {},
  icon = '',
  spell,
  style = {},
  onDelete,
}: ProjectProps) => {
  return (
    <div
      role="button"
      className={`${css['project-row']} ${
        css[selectedSpell?.name === label ? 'selected' : '']
      }`}
      onClick={e => {
        onClick(e)
      }}
      style={style}
    >
      {icon.length > 0 && (
        <Icon name={icon} style={{ marginRight: 'var(--extraSmall)' }} />
      )}
      {label}
      {onDelete && (
        <Icon
          name="trash"
          onClick={() => {
            spell?.name && onDelete(spell.name)
          }}
          style={{
            marginRight: 'var(--extraSmall)',
            position: 'absolute',
            right: 'var(--extraSmall)',
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}

export default ProjectRow

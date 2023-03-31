import { SpellInterface } from '@magickml/engine'
import { CSSProperties } from 'react'
import { Icon } from '@magickml/client-core'
import css from '../screens/HomeScreen/homeScreen.module.css'

type ProjectProps = {
  label: string
  selectedSpell?: SpellInterface
  icon?: string
  onClick: Function
  spell?: SpellInterface
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
            spell?.name && onDelete(spell.id)
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

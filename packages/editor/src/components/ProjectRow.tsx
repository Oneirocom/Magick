// GENERATED 
/**
 * Represents the props for the ProjectRow component.
 * 
 * @property {string} label - The label to display for the project row.
 * @property {SpellInterface} selectedSpell - The selected spell for the project row.
 * @property {string} icon - The icon to display for the project row.
 * @property {Function} onClick - The function to be called when the ProjectRow is clicked.
 * @property {SpellInterface} spell - The spell for the project row.
 * @property {CSSProperties} style - The style of the project row.
 * @property {Function} onDelete - The function to be called when a project row is deleted.
 */
type ProjectProps = {
  label: string
  selectedSpell?: SpellInterface
  icon?: string
  onClick: Function
  spell?: SpellInterface
  style?: CSSProperties
  onDelete?: Function
}

/**
 * Renders a single project row.
 * 
 * @param {ProjectProps} props - The props for the ProjectRow component.
 * @returns {JSX.Element} The JSX for the ProjectRow component.
 */
const ProjectRow = ({
  label,
  selectedSpell,
  onClick = () => {},
  icon = '',
  spell,
  style = {},
  onDelete,
}: ProjectProps): JSX.Element => {
  /**
   * Handle the click event for the ProjectRow component and call the `onClick` prop.
   * 
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e - The click event.
   */
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    onClick(e)
  }

  /**
   * Handle the click event for the delete icon and call the `onDelete` function with the spell id.
   */
  const handleDeleteClick = (): void => {
    spell?.name && onDelete && onDelete(spell.id)
  }

  return (
    <div
      role="button"
      className={`${css['project-row']} ${css[selectedSpell?.name === label ? 'selected' : '']}`}
      onClick={handleClick}
      style={style}
    >
      {icon.length > 0 && (
        <Icon name={icon} style={{ marginRight: 'var(--extraSmall)' }} />
      )}
      {label}
      {onDelete && (
        <Icon
          name="trash"
          onClick={handleDeleteClick}
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

export default ProjectRow;
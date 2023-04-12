// DOCUMENTED 
import { SpellInterface } from '@magickml/core';
import { CSSProperties } from 'react';
import { Icon } from '@magickml/client-core';
import css from '../screens/HomeScreen/homeScreen.module.css';

/**
 * ProjectProps type defines the properties for the ProjectRow component.
 */
type ProjectProps = {
  label: string;
  selectedSpell?: SpellInterface;
  icon?: string;
  onClick: Function;
  spell?: SpellInterface;
  style?: CSSProperties;
  onDelete?: Function;
};

/**
 * ProjectRow is a functional component that displays a row of project information.
 *
 * @param {string} label - The text to display in the row.
 * @param {SpellInterface} [selectedSpell] - The currently selected spell.
 * @param {Function} onClick - The function to call when the row is clicked.
 * @param {string} [icon] - The name of the icon to display before the label.
 * @param {SpellInterface} [spell] - The spell associated with this row.
 * @param {CSSProperties} [style] - The CSS style to apply to the row.
 * @param {Function} [onDelete] - The function to call when the delete icon is clicked.
 * @returns {JSX.Element} The rendered row component.
 */
const ProjectRow = ({
  label,
  selectedSpell,
  onClick = () => { /* null */},
  icon = '',
  spell,
  style = {},
  onDelete,
}: ProjectProps): JSX.Element => {
  return (
    <div
      role="button"
      className={`${css['project-row']} ${
        css[selectedSpell?.name === label ? 'selected' : '']
      }`}
      onClick={(e) => {
        onClick(e);
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
            spell?.name && onDelete(spell.id);
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
  );
};

export default ProjectRow;
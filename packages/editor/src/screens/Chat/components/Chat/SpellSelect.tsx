import { FC } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './styles.module.css';
import { Spell } from '@magickml/core'

interface Props {
  spell: Spell;
  spells: Spell[];
  onSpellChange: (spell: Spell) => void;
}

export const SpellSelect: FC<Props> = ({ spell, spells, onSpellChange }) => {
  return (
    <div className={styles.spellContainer}>
      <label className={styles.label}>Spell</label>
      <div className={styles.innerSelectContainer}>
        <select
          className={styles.select}
          placeholder="Select a model"
          value={spell?.id ?? spells[0]?.id}
          onChange={(e) => {
            onSpellChange(spells.find((spell) => spell?.id === e.target.value) as Spell);
          }}
        >
          {spells.map((spell) => (
            <option
              key={spell.id}
              value={spell.id}
            >
              {spell.name}
            </option>
          ))}
        </select>
        <KeyboardArrowDownIcon className={styles.icon} />
      </div>
    </div>
  );
};

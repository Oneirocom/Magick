import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { SpellRelease } from 'packages/server/core/src/services/spellReleases/spellReleases.schema';

/**
 * SpellVersionSelector component for selecting a spell version.
 *
 * @param {SpellRelease[]} spellReleaseList - List of spell releases.
 * @param {string} activeSpellReleaseId - Active spell release id.
 * @param {() => void} onChange - On change handler.
 * @param {string} tooltipText - Tooltip text.
 * @returns {JSX.Element} - SpellVersionSelector component.
 */
const SpellVersionSelector = ({
  spellReleaseList,
  activeSpellReleaseId,
  onChange,
  tooltipText
}: {
  spellReleaseList: SpellRelease[],
  activeSpellReleaseId: string,
  onChange: () => void,
  tooltipText: string
}): JSX.Element => {

  const selectedRelease = spellReleaseList.find((spell) => spell.id === activeSpellReleaseId);

  const val = selectedRelease ? `${selectedRelease?.versionName} (${selectedRelease?.createdAt})` : 'Default';

  return (
    <div className="form-item agent-select">
      <Tooltip title={tooltipText} placement="right" disableInteractive arrow>
        <span className="form-item-label">Spell Release Version</span>
      </Tooltip>
      <select
        name="spellRelease"
        id="spellReleaseId"
        value={val}
        onChange={onChange}
      >
        <option disabled value="default">
          Select Spell
        </option>
        {spellReleaseList && spellReleaseList.length > 0 &&
          spellReleaseList.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
            .map((spell, idx) => (
              <option value={spell.id} key={idx}>
                {`${selectedRelease?.versionName} (${selectedRelease?.createdAt})`}
              </option>
            ))
        }
      </select>
    </div>
  );
};

export default SpellVersionSelector;

import React, { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { SpellReleaseInterface } from 'server/schemas';

const SpellVersionSelector = ({
  spellReleaseList,
  activeSpellReleaseId,
  onChange,
  tooltipText,
}: {
  spellReleaseList: SpellReleaseInterface[],
  activeSpellReleaseId: string,
  onChange: (spellReleaseId: string) => Promise<void>,
  tooltipText: string
}): React.JSX.Element => {

  const [selectedRelease, setSelectedRelease] = useState<SpellReleaseInterface | null>(null);

  const formatDate = (date: string) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: false });
  };

  useEffect(() => {
    // Update the local state whenever activeSpellReleaseId changes
    const release = spellReleaseList.find(release => release.id === activeSpellReleaseId);
    setSelectedRelease(release || null);
  }, [activeSpellReleaseId, spellReleaseList]);


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReleaseId = event.target.value;
    onChange(newReleaseId); // Invoke the passed onChange handler
    const newSelectedRelease = spellReleaseList.find(release => release.id === newReleaseId);
    setSelectedRelease(newSelectedRelease || null);
  };

  const sortedSpellReleaseList = [...spellReleaseList].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="form-item agent-select">
      <Tooltip title={tooltipText} placement="right" disableInteractive arrow>
        <span className="form-item-label">Spell Release Version</span>
      </Tooltip>
      <select
        name="spellRelease"
        id="spellReleaseId"
        value={selectedRelease?.id || ''}
        onChange={handleSelectChange}
        style={{ maxWidth: '100%' }}
      >
        <option value="" disabled>
          Select Spell Release Version
        </option>
        {sortedSpellReleaseList.map((spell, idx) => (
          <option value={spell.id} key={spell.id}>
            {`Version 0.0.${sortedSpellReleaseList.length - idx} - Released ${formatDate(spell.createdAt)}`}
          </option>
        ))}
      </select>
      {selectedRelease?.description && (
        <div style={{
          marginTop: '8px',
          marginBottom: '8px',
        }}>
          <p>Release Notes:</p>
          <p>{selectedRelease.description}</p>
        </div>
      )}
    </div>
  );
};

export default SpellVersionSelector;

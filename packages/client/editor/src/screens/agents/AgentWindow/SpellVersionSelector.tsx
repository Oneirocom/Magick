import React, { useState, useEffect } from 'react'
import Tooltip from '@mui/material/Tooltip'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { SpellReleaseInterface } from 'server/schemas'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@magickml/client-ui' // Assuming a similar API

type SpellVersionSelectorProps = {
  spellReleaseList: SpellReleaseInterface[]
  activeSpellReleaseId: string
  onChange: (spellReleaseId: string) => Promise<void>
  tooltipText: string
}

const SpellVersionSelector: React.FC<SpellVersionSelectorProps> = ({
  spellReleaseList,
  activeSpellReleaseId,
  onChange,
  tooltipText,
}) => {
  const [selectedRelease, setSelectedRelease] =
    useState<SpellReleaseInterface | null>(null)

  const formatDate = (date: string) => {
    if (!date) return ''
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  useEffect(() => {
    const release = spellReleaseList.find(
      release => release.id === activeSpellReleaseId
    )
    setSelectedRelease(release || null)
  }, [activeSpellReleaseId, spellReleaseList])

  const handleSelectChange = async (spellReleaseId: string) => {
    await onChange(spellReleaseId)
    const newSelectedRelease = spellReleaseList.find(
      release => release.id === spellReleaseId
    )
    setSelectedRelease(newSelectedRelease || null)
  }

  const sortedSpellReleaseList = [...spellReleaseList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="form-item agent-select">
      <Tooltip title={tooltipText} placement="right" disableInteractive arrow>
        <span className="form-item-label">Spell Release Version</span>
      </Tooltip>
      <Select
        value={selectedRelease?.id || ''}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Spell Release Version" />
        </SelectTrigger>
        <SelectContent>
          {sortedSpellReleaseList.map((spell, idx) => (
            <SelectItem key={spell.id} value={spell.id}>
              {`Version 0.0.${
                sortedSpellReleaseList.length - idx
              } - Released ${formatDate(spell.createdAt)}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedRelease?.description && (
        <div style={{ marginTop: '8px', marginBottom: '8px' }}>
          <p>Release Notes:</p>
          <p>{selectedRelease.description}</p>
        </div>
      )}
    </div>
  )
}

export default SpellVersionSelector

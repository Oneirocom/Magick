import React, { useState } from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'
import { ConfigurationComponentProps } from './PropertiesWindow'

export const SelectedEvents = (props: ConfigurationComponentProps) => {
  const { updateConfigKey, config, fullConfig } = props
  const [configKey, _selectedEvents] = config
  const availableEvents = fullConfig.availableEvents
  const [selectedEvents, setSelectedEvents] = useState(_selectedEvents || [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    eventProperty: string
  ) => {
    const newSelection = event.target.checked
      ? [...selectedEvents, eventProperty]
      : selectedEvents.filter((e: string) => e !== eventProperty)
    setSelectedEvents(newSelection)
    // would rather not hard code this string here
    updateConfigKey(configKey, newSelection)
  }

  return (
    <div>
      <h3>Event Filter</h3>
      <div className="flex flex-col">
        {availableEvents.map((eventProperty: string, index: number) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selectedEvents.includes(eventProperty)}
                onChange={e => handleChange(e, eventProperty)}
              />
            }
            label={eventProperty}
          />
        ))}
      </div>
    </div>
  )
}

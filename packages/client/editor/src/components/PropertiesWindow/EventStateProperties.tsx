import React, { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { Checkbox, FormControlLabel } from '@mui/material'
import { ConfigurationComponentProps } from './PropertiesWindow'
// import { InfoIcon } from '@magickml/icons'

export const EventStateProperties = (props: ConfigurationComponentProps) => {
  const { updateConfigKey, config, fullConfig } = props
  const [, eventProperties] = config
  const eventStateValue = fullConfig.eventState
  const [selectedEvents, setSelectedEvents] = useState(eventStateValue || [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    eventProperty: string
  ) => {
    const newSelection = event.target.checked
      ? [...selectedEvents, eventProperty]
      : selectedEvents.filter((e: string) => e !== eventProperty)
    setSelectedEvents(newSelection)
    // would rather not hard code this string here
    updateConfigKey('eventState', newSelection)
  }

  return (
    <div>
      <h3>
        Event State{' '}
        {/* <span
          className="inline"
          data-tooltip-id="eventState"
          data-tooltip-variant="light"
        >
          <InfoIcon className="inline mb-2" />
        </span> */}
      </h3>

      <Tooltip anchorSelect="#my-anchor-element" content="Hello world!" />

      <div className="flex flex-col">
        {eventProperties.map((eventProperty: string, index: number) => (
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

import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from "@mui/material";
import { ConfigurationComponentProps } from "./PropertiesWindow"

const eventProperties = [
  'connector',
  'client',
  'channel',
  'agentId',
  'sender'
];

export const EventStateProperties = (props: ConfigurationComponentProps) => {
  const { updateConfigKey, config } = props;
  const [key, value] = config
  const [selectedEvents, setSelectedEvents] = useState(value || []);

  const handleChange = (event, eventProperty) => {
    const newSelection = event.target.checked
      ? [...selectedEvents, eventProperty]
      : selectedEvents.filter(e => e !== eventProperty);
    setSelectedEvents(newSelection);
    updateConfigKey(key, newSelection);
  };

  return (
    <div>
      <h3>Event State</h3>
      <div className="flex flex-col">
        {eventProperties.map((eventProperty, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selectedEvents.includes(eventProperty)}
                onChange={(e) => handleChange(e, eventProperty)}
              />
            }
            label={eventProperty}
          />
        ))}
      </div>
    </div>
  );
};

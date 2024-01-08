import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from "@mui/material";
import { ConfigurationComponentProps } from "./PropertiesWindow"

export const EventStateProperties = (props: ConfigurationComponentProps) => {
  const { updateConfigKey, config, fullConfig } = props;
  const [, eventProperties] = config
  const eventStateValue = fullConfig.eventState
  const [selectedEvents, setSelectedEvents] = useState(eventStateValue || []);

  const handleChange = (event, eventProperty) => {
    const newSelection = event.target.checked
      ? [...selectedEvents, eventProperty]
      : selectedEvents.filter(e => e !== eventProperty);
    setSelectedEvents(newSelection);
    // would rather not hard code this string here
    updateConfigKey('eventState', newSelection);
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

// DOCUMENTED 
/**
 * A component that represents a temperature input field.
 */
import React from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import Label from './Label';

/**
 * @returns {JSX.Element} The temperature input component.
 */
export default function Temperature(): JSX.Element {
  // Get the form context for form registration.
  const form = useFormContext();

  return (
    /** The temperature input wrapped with a labeled container. */
    <Label label="Temperature">
      <TextField
        // Restrict input to positive numbers.
        min={0}
        // Restrict input to numbers less than or equal to 1.
        max={1}
        // Set the increment steps for the input value.
        inputProps={{
          step: 0.1
        }}
        // Set the input to a number type.
        type="number"
        // Register the temperature field with the form context.
        {...form.register('temperature', { min: 0, max: 1 })}
      />
    </Label>
  )
}
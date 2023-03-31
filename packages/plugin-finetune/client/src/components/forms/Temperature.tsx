// DOCUMENTED 
/**
 * A component for rendering a temperature input field with a label.
 * @returns JSX.Element
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import Label from './Label';

export default function Temperature(): JSX.Element {
  const form = useFormContext();

  return (
    <Label label="Temperature">
      <TextField
        min={0}
        max={1}
        inputProps={{
          step: 0.1,
        }}
        type="number"
        {...form.register('temperature', { min: 0, max: 1 })}
      />
    </Label>
  );
}

/**
 * Imports:
 * - `React` for its use of JSX
 * - `useFormContext` from `react-hook-form` to retrieve context from parent form element
 * - `TextField` from `@mui/material` to render the input field
 * - `Label` from the local `./Label` component to render the label
 *
 * Exports:
 * - A function that returns a JSX element
 * - Although, no external functions or components are being exported by default in this module
 *
 * @packageDocumentation
 */
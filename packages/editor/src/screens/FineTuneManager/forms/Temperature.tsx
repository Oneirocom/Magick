import { TextField } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import Label from './Label'

export default function Temperature() {
  const form = useFormContext()

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
  )
}

import React from 'react';
import { Input } from '@magickml/ui';
import { v4 as uuidv4 } from 'uuid'

export const TextInputField = ({
  value,
  onChange,
  onFocus,
  handleBlur,
}: {
  value: string
  onChange: (e) => void
  onFocus?: (inputId: string) => void
  handleBlur?: () => void
}) => {

  const inputId = React.useMemo(() => `text-input::${uuidv4()}`, []);
  return (
    <Input
      id={inputId}
      className='bg-dark-3 h-5 rounded-sm px-2'
      type="text"
      placeholder="input text..."
      value={value}
      onChange={(e) => onChange(e)}
      onFocus={() => onFocus(inputId)}
      onBlur={handleBlur}
    />
  )
};

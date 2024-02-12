import { Input } from '@magickml/client-ui'
import React from 'react'

export const TextInputField = ({
  value,
  onChange,
  onFocus,
  handleBlur,
}: {
  value: string
  onChange?: (e) => void
  onFocus?: () => void
  handleBlur?: () => void
}) => {
  return (
    <Input
      className="bg-dark-3 h-5 rounded-sm px-2"
      type="text"
      placeholder="input text..."
      value={value}
      onChange={e => {
        onChange && onChange(e)
      }}
      onFocus={() => {
        onFocus && onFocus()
      }}
      onBlur={() => {
        handleBlur && handleBlur()
      }}
    />
  )
}

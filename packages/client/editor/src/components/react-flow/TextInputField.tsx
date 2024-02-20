import { Input } from '@magickml/client-ui'
import React from 'react'

export const TextInputField = ({
  value,
  onChange,
  onFocus,
  handleBlur,
  className,
  type,
  placeholder,
  onKeyDown,
  required = false,
}: {
  value: string
  onChange?: (e) => void
  onFocus?: (x) => void
  onKeyDown?: (e) => void
  handleBlur?: () => void
  className?: string
  type?: string
  placeholder?: string
  required?: boolean
}) => {
  return (
    <Input
      className={`${className ?? ''}`}
      type={type || 'text'}
      placeholder={placeholder || 'input text...'}
      required={required}
      value={value}
      onChange={e => {
        onChange && onChange(e)
      }}
      onFocus={e => {
        onFocus && onFocus(e.currentTarget.value)
      }}
      onBlur={() => {
        handleBlur && handleBlur()
      }}
      onKeyDown={e => {
        onKeyDown && onKeyDown(e)
      }}
    />
  )
}

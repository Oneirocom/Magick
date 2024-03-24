import * as React from 'react'
import { Switch, SwitchProps, Label } from '../../core/ui'

interface InputWithLabelProps extends SwitchProps {
  label?: string
  id: string
}

export const SwitchWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  id,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      {label && (
        <Label className="font-medium text-sm" htmlFor={id}>
          {label}
        </Label>
      )}
      <Switch id={id} {...props} />
    </div>
  )
}

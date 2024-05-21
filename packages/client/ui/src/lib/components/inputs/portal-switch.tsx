"use client";
import * as React from 'react'
import { Switch, SwitchProps, Label } from '../../core/ui'
import { cn } from '../../utils/shadcn'

interface InputWithLabelProps extends SwitchProps {
  label?: string
  id: string
  className?: string
}

export const SwitchWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  id,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      {label && (
        <Label className="font-medium text-sm" htmlFor={id}>
          {label}
        </Label>
      )}
      <Switch
        className={cn(
          'data-[state=unchecked]:bg-ds-card-alt data-[state=unchecked]:border-ds-neutral data-[state=unchecked]:border',
          className
        )}
        id={id}
        {...props}
      />
    </div>
  )
}

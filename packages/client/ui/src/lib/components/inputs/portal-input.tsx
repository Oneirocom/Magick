import * as React from 'react'
import { Label, Input, type InputProps } from '../../core/ui'
import { cn } from '../../utils/shadcn'

interface InputWithLabelProps extends React.ComponentProps<typeof Input> {
  label?: string
  id: string
  className?: string
}

export const InputWithLabel: React.FC<InputWithLabelProps> = ({
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
      <Input
        id={id}
        className={cn(
          'h-10 px-3 m-0 py-2 bg-ds-card-alt placeholder:font-normal rounded-md border border-ds-neutral text-sm',
          className
        )}
        {...props}
      />
    </div>
  )
}

"use client";
import * as React from 'react'
import { Label, Textarea, type TextareaProps } from '../../core/ui'
import { cn } from '../../utils/shadcn'

interface TextareaWithLabelProps extends TextareaProps {
  label?: string
}

export const TextareaWithLabel: React.FC<TextareaWithLabelProps> = ({
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
      <Textarea
        id={id}
        className={cn(
          'px-3 py-2 bg-ds-card-alt placeholder:font-normal rounded-md border border-ds-neutral text-sm',
          className
        )}
        {...props}
      />
    </div>
  )
}
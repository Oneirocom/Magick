import * as React from 'react'
import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../core/ui'
import { cn } from '../../utils/shadcn'

interface InputWithLabelProps extends React.ComponentProps<typeof Select> {
  label?: string
  id: string
  className?: string
  options: Array<{ value: string; label: string }>
  group?: string
  placeholder?: string
}

export const SelectWithLabel: React.FC<InputWithLabelProps> = ({
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
      <Select {...props}>
        <SelectTrigger
          className={cn(
            'h-10 px-3 m-0 py-2 bg-ds-card-alt placeholder:font-normal rounded-md border border-ds-neutral text-sm',
            className
          )}
        >
          <SelectValue placeholder={props.placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent className="max-h-52 overflow-y-auto">
          <SelectGroup>
            <SelectLabel>{props.group}</SelectLabel>
            {props.options.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="hover:bg-white/20 focus:bg-white/20"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

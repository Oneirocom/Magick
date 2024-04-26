import React, { FC } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { cn } from '../../utils/shadcn'

interface DropdownProps {
  options: Array<{ value: string; label: string; icon?: string }>
  selectedValue: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const Dropdown: FC<DropdownProps> = ({
  options,
  selectedValue,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <Select onValueChange={onChange} value={selectedValue}>
      <SelectTrigger
        className={cn(
          'h-10 border-ds-neutral bg-ds-card-alt rounded-[5px] normal-case data-[placeholder]:text-white/50',
          className
        )}
      >
        <SelectValue placeholder={placeholder || 'Select an option'} />
      </SelectTrigger>
      <SelectContent className="bg-ds-card-alt">
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="hover:bg-white/20 focus:bg-white/20"
          >
            <div className="inline-flex gap-x-0.5 items-center justify-center">
              {option.icon && (
                <img alt="" src={option.icon} className="w-4 h-4 mr-2" />
              )}
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

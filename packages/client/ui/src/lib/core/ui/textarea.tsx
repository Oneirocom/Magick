"use client";
import * as React from 'react'

import { cn } from '../../utils/shadcn'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-[5px] border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:font-sans font-sans placeholder:text-black/60 dark:placeholder:text-white/60 disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }

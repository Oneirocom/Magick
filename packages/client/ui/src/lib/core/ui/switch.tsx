"use client";
import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/shadcn'

const switchVariants = cva(
  'peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-ds-secondary data-[state=unchecked]:bg-ds-card',
  {
    variants: {
      size: {
        default: 'h-[20px] w-[36px]',
        small: 'h-[10px] w-[38px]',
        large: 'h-[24px] w-[48px]',
      },
      secondary: {
        'bg-secondary': '!bg-ds-secondary',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const thumbVariants = cva(
  'pointer-events-none block h-5 w-5 rounded-full bg-ds-alert shadow-lg ring-0 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 transition-transform data-[state=unchecked]:dark:bg-ds-secondary',
  {
    variants: {
      translateX: {
        small: 'data-[state=unchecked]:!translate-x-[-2px]',
      },
      secondaryThumb: {
        'bg-secondary': 'bg-ds-primary',
      },
    },
  }
)

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants>,
    VariantProps<typeof thumbVariants> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    { size, secondary, translateX, secondaryThumb, className, ...props },
    ref
  ) => (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ size, secondary, className }))}
      ref={ref}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          thumbVariants({
            translateX,
            secondaryThumb,
          })
        )}
      />
    </SwitchPrimitives.Root>
  )
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch, switchVariants, thumbVariants }

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/shadcn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium font-montserrat transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost:
          'hover:border border-ds-primary color-transition backdrop-blur-[2px]',
        link: 'text-primary underline-offset-4 hover:underline',
        basic:
          'font-bold bg-ds-neutral text-ds-white border rounded-sm relative button-transition hover:border hover:border-ds-primary',
        primary:
          'bg-ds-primary text-primary-foreground shadow font-bold capitalize dark:border-2 dark:border-[#BADDE4] text-white hover:text-accent-foreground text-lg font-montAlt button-transition hover:bg-transparent rounded-lg',
        agent:
          'bg-transparent font-montserrat lg:dark:bg-[#262b2e] text-base gap-x-2 rounded-lg lg:bg-[#e9edf1] hover:bg-secondary-highlight/80 dark:hover:bg-[#3C3F41] text-black dark:text-white font-montserrat',

        'portal-primary':
          'bg-ds-primary text-ds-black font-bold font-montserrat',
        'portal-neutral':
          'bg-ds-neutral text-ds-white font-medium font-montserrat',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        md: 'h-10 rounded-lg px-4 text-base',
        lg: 'h-12 rounded-lg px-4',
        icon: 'h-9 w-9',
        responsive: 'h-8 lg:h-12 rounded-md px-3 lg:px-4 text-xs lg:text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from '../../core/ui'
import { cn } from '../../utils/shadcn'

export enum DialogType {
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export interface PortalDialogBaseProps {
  root?: React.ComponentProps<typeof Dialog>
  trigger?: React.ComponentProps<typeof DialogTrigger>
  content?: React.ComponentProps<typeof DialogContent>
  header?: React.ComponentProps<typeof DialogHeader>
  title?: React.ComponentProps<typeof DialogTitle>
  description?: React.ComponentProps<typeof DialogDescription>
  footer?: React.ComponentProps<typeof DialogFooter>
}

export interface PortalDialogProps {
  base: PortalDialogBaseProps
  title: string
  description: string
  children: React.ReactNode
  triggerButton?: React.ComponentProps<typeof Button>
  footerButton?: React.ComponentProps<typeof Button> & { isLoading?: boolean }
  triggerText?: string
  footerText?: string
  type?: DialogType
  noTrigger?: boolean
}

export const PortalDialog = ({
  base,
  title,
  description,
  children,
  triggerButton,
  footerButton,
  triggerText,
  footerText,
  type,
  noTrigger = true,
}: PortalDialogProps) => {
  const { className, ...rest } = base.content || {}
  return (
    <Dialog {...base.root}>
      <DialogTrigger asChild {...base.trigger}>
        {!noTrigger && <Button {...triggerButton}>{triggerText}</Button>}
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={e => e.preventDefault()}
        className={cn(
          'max-w-[448px] sm:rounded-[5px] p-0 m-0 px-8 pt-14 pb-8 flex-col w-full gap-8',
          type === DialogType.INFO && 'border-ds-neutral',
          type === DialogType.ERROR && 'border-ds-error',
          type === DialogType.SUCCESS && 'border-ds-alert',
          type === DialogType.WARNING && 'border-ds-warning',
          className
        )}
        {...rest}
      >
        <DialogHeader className="w-full gap-8" {...base.header}>
          <DialogTitle
            className="text-2xl font-bold font-montAlt"
            {...base.title}
          >
            {title}
          </DialogTitle>
          <DialogDescription
            className="text-base text-ds-black dark:text-white font-normal"
            {...base.description}
          >
            {description}
          </DialogDescription>
        </DialogHeader>

        {children}
        <DialogFooter {...base.footer}>
          <Button {...footerButton} disabled={footerButton?.isLoading}>
            {footerButton?.isLoading && <Loading />}
            {footerText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const Loading = () => {
  return <span className="loading loading-spinner text-ds-black mr-1" />
}

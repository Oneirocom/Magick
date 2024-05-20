"use client";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@magickml/client-ui'
import clsx from 'clsx'
import { MagickIcon } from '@magickml/icons'
import { FunctionComponent } from 'react'

type MagickDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  description?: string
  trigger?: React.ReactNode
  children?: React.ReactNode
  submitText?: string
  hideButton?: boolean
  onSubmit?: () => void
  clear?: () => void
  logo?: boolean
  destructive?: boolean
  submitDisabled?: boolean
  isLoading?: boolean
  submitButton?: boolean
  contentClassNames?: string
  titleClassNames?: string
  type?: 'info' | 'error' | 'success' | 'warning'
  noClose?: boolean
}

export const MagickDialog: FunctionComponent<MagickDialogProps> = ({
  open,
  setOpen,
  title,
  description,
  trigger,
  children,
  hideButton = false,
  submitText = 'Save changes',
  onSubmit = () => {},
  clear = () => {},
  logo = true,
  destructive = false,
  submitDisabled = false,
  isLoading = false,
  submitButton = true,
  contentClassNames,
  titleClassNames,
  type = 'info',
  noClose = false,
}) => {
  return (
    <Dialog
      onOpenChange={isOpen => {
        if (!isOpen) {
          setOpen(false)
          clear()
        }
      }}
      open={open}
      modal={true}
    >
      {!hideButton && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          'max-w-[420px] text-black dark:text-ds-white rounded bg-ds-card border-ds-neutral',
          type === 'info' && 'border-ds-neutral',
          type === 'error' && 'border-ds-error',
          type === 'success' && 'border-ds-alert',
          type === 'warning' && 'border-ds-warning'
        )}
        onPointerDownOutside={e => e.preventDefault()}
        noClose={noClose}
      >
        <DialogHeader>
          {logo && (
            <MagickIcon
              width={120}
              height={22}
              className="mx-auto my-4 text-black dark:text-ds-white"
            />
          )}
          <DialogTitle className={clsx('py-4 !font-montAlt', titleClassNames)}>
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription
              className={clsx(
                destructive ? 'text-red-500' : 'text-black dark:text-ds-white',
                'font-sans font-medium text-xs'
              )}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className={cn('grid gap-4 py-4', contentClassNames)}>
          {children}
        </div>
        <DialogFooter className="mx-auto">
          {submitButton && (
            <Button
              className=" text-[#0b0d0e] font-bold min-w-[200px]"
              onClick={onSubmit}
              disabled={submitDisabled}
            >
              {submitText}
              {isLoading && (
                <div
                  className="inline-block ml-4 h-4 w-4 animate-spin rounded-full border-2 border-solid border-ds-white border-r-transparent align-[-0.125em] text-info motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

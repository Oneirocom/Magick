import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@magickml/client-ui'
import clsx from 'clsx'
import { MagickIcon } from '../icons'
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
    >
      {!hideButton && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[320px] text-black dark:text-ds-white rounded dark:bg-[#262B2E] bg-[#E9EDF1]">
        <DialogHeader>
          {logo && (
            <MagickIcon
              width={120}
              height={22}
              className="mx-auto my-4 text-black dark:text-ds-white"
            />
          )}
          <DialogTitle className="py-4 text-center font-montserrat">
            {title}
          </DialogTitle>
          <DialogDescription
            className={clsx(
              destructive ? 'text-red-500' : 'text-black dark:text-ds-white',
              'text-center font-montserrat font-medium'
            )}
          >
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
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

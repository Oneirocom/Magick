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
import { FunctionComponent } from 'react'

type MagickUnauthorizedDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  description?: string
  trigger?: React.ReactNode
  children?: React.ReactNode
  submitText?: string
  onSubmit?: () => void
}

export const MagickUnauthorizedDialog: FunctionComponent<
  MagickUnauthorizedDialogProps
> = ({
  open,
  setOpen,
  title,
  description,
  trigger,
  children,
  submitText = 'Save changes',
  onSubmit = () => {},
}) => {
  return (
    <Dialog
      onOpenChange={isOpen => {
        if (!isOpen) {
          setOpen(false)
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          <Button onClick={onSubmit}>{submitText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

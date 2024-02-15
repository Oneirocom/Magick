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

type MagickDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  description?: string
  trigger?: React.ReactNode
  children?: React.ReactNode
}

export const MagickContentDialog: FunctionComponent<MagickDialogProps> = ({
  open,
  setOpen,
  title,
  description,
  trigger,
  children,
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
          <Button onClick={() => setOpen(false)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

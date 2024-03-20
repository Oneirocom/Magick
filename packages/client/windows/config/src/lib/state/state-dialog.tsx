import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from '@magickml/client-ui'
import type { FC } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { IdCardIcon } from '@radix-ui/react-icons'

interface StateDialogProps {
  pluginName: string
  state: string
}

export const StateDialog: FC<StateDialogProps> = ({ pluginName, state }) => {
  const cappedName = pluginName
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase())
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="clear" size="icon">
          <IdCardIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{cappedName} Plugin State</DialogTitle>
          <DialogDescription>
            View the state object for your agents {cappedName} plugin.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full">
          <CodeMirror
            theme="dark"
            value={state}
            height="440px"
            extensions={[json()]}
            onChange={value => console.log(value)}
            readOnly={true}
          />
        </div>
        <DialogFooter>
          <p className="text-xs text-white/60">
            Last updated: {new Date().toLocaleString()}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

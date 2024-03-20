import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  Switch,
  cn,
} from '@magickml/client-ui'
import { FC } from 'react'
import { StateDialog } from '../../state/state-dialog'
import { QuestionMarkIcon } from '@radix-ui/react-icons'
import { PluginStateType } from './plugin-credential-card'

interface PluginCredentialCardHeaderProps {
  base: any
  state: PluginStateType
  allLinked: boolean
  loading: boolean
  handleSendCommand: (command: string, payload: any) => Promise<void>
}

export const PluginCredentialCardHeader: FC<
  PluginCredentialCardHeaderProps
> = ({ base, state, allLinked, loading, handleSendCommand }) => {
  const openHelpLink = () => {
    if (base.helpLink) {
      window.open(base.helpLink, '_blank')
    }
  }

  return (
    <div className="inline-flex items-center justify-between w-full pb-2 border-b border-b-white/10">
      <div className="inline-flex gap-x-1 items-center">
        <Avatar>
          <AvatarImage src={base.icon} alt={base.clientName} />
          <AvatarFallback>{base.initials}</AvatarFallback>
        </Avatar>
        <p className="ml-2 text-sm font-semibold capitalize">
          {base.pluginName}
        </p>
        <Switch
          className="ml-4"
          checked={state?.enabled}
          disabled={!allLinked}
          onCheckedChange={enabled => {
            handleSendCommand(enabled ? 'enable' : 'disable', { enabled })
          }}
        />
        <span
          className={cn(
            'text-sm font-medium ml-1.5',
            state.enabled ? 'text-green-500' : 'text-white/60'
          )}
        >
          {state.enabled ? 'Enabled' : 'Disabled'}
        </span>
        {loading ? (
          <span className="loading loading-spinner loading-xs text-white">
            Saving...
          </span>
        ) : null}
      </div>

      <div className="flex items-center">
        <StateDialog
          state={JSON.stringify(state, null, 2)}
          pluginName={base.pluginName}
        />
        <Button variant="clear" size="icon" onClick={openHelpLink}>
          <QuestionMarkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

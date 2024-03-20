import { FC, useState } from 'react'
import type { CredentialCardProps } from '../core/credential-card'
import { useSendCommandMutation, SendCommandBody, rootApi } from 'client/state'
import toast from 'react-hot-toast'
import { PluginCredentialCardHeader } from './plugin-credential-card-header'
import { PluginCredentialCardContent } from './plugin-credential-card-content'

export type PluginStateType<T extends object = Record<string, unknown>> = T & {
  enabled: boolean
}

interface PluginCredentialCardProps {
  agentId: string
  projectId: string
  credentials: CredentialCardProps[]
  state: PluginStateType
}

export const PluginCredentialCard: FC<PluginCredentialCardProps> = props => {
  const { credentials, projectId, agentId, state } = props
  const base = credentials[0].credential

  const allLinked = credentials.every(c => c.status.linked)
  const [loading, setLoading] = useState(false)
  const [sendCommand] = useSendCommandMutation()

  const handleSendCommand = async (command: string, payload: any) => {
    setLoading(true)
    try {
      const c = SendCommandBody.parse({
        agentId,
        projectId,
        plugin: base.pluginName,
        command,
        payload,
      })
      await sendCommand({
        projectId,
        ...c,
      })
    } catch (e) {
      toast.error('Failed to send command')
      setLoading(false)
    }

    setTimeout(() => {
      setLoading(false)
      rootApi.util.invalidateTags(['PluginState'])
    }, 2000)

    toast.success(`Enabling ${base.pluginName}. Please check back in a moment.`)
  }

  const headerProps = {
    base,
    state,
    allLinked,
    loading,
    handleSendCommand,
  }

  return (
    <div className="flex flex-col items-start justify-start border-2 bg-[#282d33] border-white/10 rounded-sm p-4">
      <PluginCredentialCardHeader {...headerProps} />
      <PluginCredentialCardContent credentials={credentials} />
    </div>
  )
}

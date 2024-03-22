import { FC, useState } from 'react'
import { useListCredentialsQuery } from 'client/state'
import { useConfig } from '@magickml/providers'
import { getAvailablePlugins, findCredentialId } from './utils'
import { CredentialsHeader } from './credentials-header'
import { CredentialCard } from './core/credential-card'
import { PluginCredentialCard } from './plugin/plugin-credential-card'
import { CredentialsTab, CredentialsTabs } from './credentials-tabs'
import {
  useGetPluginStateQuery,
  PluginState,
  useGetCredentialsQuery,
} from 'client/state'
import { CredentialsDialog } from './dialog/credentials-dialog'

type ConfigCredentialsProps = {
  agentId: string
}

const getPluginState = (pluginState: PluginState[], pluginName: string) => {
  const state = pluginState.find(p => p.plugin === pluginName)
    ?.state as PluginState
  return {
    enabled: false,
    ...state,
  }
}

export const ConfigCredentials: FC<ConfigCredentialsProps> = ({ agentId }) => {
  const tab = useState(CredentialsTab.CORE)
  const config = useConfig()
  const all = getAvailablePlugins()

  const { data: pluginState } = useGetPluginStateQuery(
    {
      projectId: config.projectId,
      agentId,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  )

  const { data: agentSecrets } = useGetCredentialsQuery(
    {
      projectId: config.projectId,
      agentId,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  )

  const { data: projectSecrets } = useListCredentialsQuery({
    projectId: config.projectId,
  })

  return (
    <div className="w-full">
      <CredentialsHeader
        title="Secrets"
        description={`Link secrets (API keys, tokens, etc) to your Agent to use in your spells and connect to external services.`}
      />

      <CredentialsTabs
        value={tab[0]}
        setTab={tab[1]}
        core={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {all['core']?.map(p => (
              <CredentialCard
                key={p.name}
                credential={p}
                status={findCredentialId({
                  pluginName: 'core',
                  secretName: p.name,
                  arr: (agentSecrets as any) || [],
                })}
                action={
                  <CredentialsDialog
                    projectId={config.projectId}
                    agentId={agentId}
                    credName={p.name}
                    clientName={p.clientName ?? p.name}
                    isCore={true}
                    serviceType={p.serviceType}
                    pluginName="core"
                    agentSecret={findCredentialId({
                      pluginName: 'core',
                      secretName: p.name,
                      arr: (agentSecrets as any) || [],
                    })}
                    projectSecrets={projectSecrets || []}
                  />
                }
              />
            ))}
          </div>
        }
        plugin={
          <div className="flex flex-col gap-y-6">
            {Object.keys(all).map(key => {
              if (key === 'core') return null
              return (
                <div key={key} className="gap-y-1 pb-2 flex flex-col">
                  <PluginCredentialCard
                    agentId={agentId}
                    projectId={config.projectId}
                    credentials={all[key].map(c => ({
                      credential: c,
                      status: findCredentialId({
                        pluginName: c.pluginName,
                        secretName: c.name,
                        arr: (agentSecrets as any) || [],
                      }),
                      action: (
                        <CredentialsDialog
                          projectId={config.projectId}
                          agentId={agentId}
                          credName={c.name}
                          clientName={c.clientName ?? c.name}
                          isCore={true}
                          serviceType={c.serviceType}
                          pluginName={c.pluginName}
                          agentSecret={findCredentialId({
                            pluginName: c.pluginName,
                            secretName: c.name,
                            arr: (agentSecrets as any) || [],
                          })}
                          projectSecrets={projectSecrets || []}
                        />
                      ),
                    }))}
                    state={getPluginState(pluginState || [], key)}
                  />
                </div>
              )
            })}
          </div>
        }
      />
    </div>
  )
}

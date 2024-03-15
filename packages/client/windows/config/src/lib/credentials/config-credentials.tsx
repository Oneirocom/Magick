import credentialsJson from 'packages/shared/nodeSpec/src/credentials.json'
import { FC } from 'react'
import {
  useListCredentialsQuery,
  useListAgentCredentialsQuery,
} from 'client/state'
import { useConfig } from '@magickml/providers'
import {
  separateCredentials,
  hasLinkedAgentCredential,
  findMatchingAgentCredential,
  findMatchingCredentials,
  type PluginCredential,
} from './utils'
import { CredentialAction } from './credential-action'
import { CredentialItem } from './credential-item'
import { CredentialsHeader } from './credentials-header'

type ConfigCredentialsProps = {
  agentId: string
}

export const ConfigCredentials: FC<ConfigCredentialsProps> = ({ agentId }) => {
  const pluginCredentials: PluginCredential[] = credentialsJson.filter(
    cred => cred.available
  ) as PluginCredential[]
  const config = useConfig()
  const { data: c } = useListCredentialsQuery({
    projectId: config.projectId,
  })

  const [credentials, custom] = separateCredentials(c || [])

  const { data: ac } = useListAgentCredentialsQuery({
    projectId: config.projectId,
    agentId,
  })

  return (
    <>
      <CredentialsHeader />

      {/* Plugin Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pluginCredentials?.map(p => (
          <CredentialItem
            key={p.name}
            credential={p}
            isLinked={hasLinkedAgentCredential(p.name, credentials, ac)}
            action={
              <CredentialAction
                projectId={config.projectId}
                agentId={agentId}
                linkedCredential={findMatchingAgentCredential(
                  p,
                  credentials,
                  ac
                )}
                availableCredentials={findMatchingCredentials(p, credentials)}
              />
            }
          />
        ))}
      </div>
      {/* section that lists linked credentials with serviceType 'custom' and allows linking/unlinking */}
      <div className="mt-8\">
        <h2>Custom Credentials</h2>
        <p>
          Custom credentials are secrets that you create in the secrets window
          and link to this agent.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {custom?.map(c => (
            <CredentialItem
              key={c.name}
              credential={{
                name: c.name,
                serviceType: c.serviceType as 'custom',
                credentialType: c.credentialType as 'custom',
                initials: c.name.charAt(0),
                description: c.description || '',
                available: true,
              }}
              isLinked={hasLinkedAgentCredential(c.name, custom, ac)}
              action={
                <CredentialAction
                  custom={true}
                  customId={c.id}
                  projectId={config.projectId}
                  agentId={agentId}
                  linkedCredential={findMatchingAgentCredential(
                    {
                      ...c,
                      available: true,
                      initials: c.name.charAt(0),
                    } as PluginCredential,
                    credentials,
                    ac
                  )}
                  availableCredentials={findMatchingCredentials(
                    {
                      ...c,
                      available: true,
                      initials: c.name.charAt(0),
                    } as PluginCredential,
                    custom
                  )}
                />
              }
            />
          ))}
        </div>
      </div>
    </>
  )
}

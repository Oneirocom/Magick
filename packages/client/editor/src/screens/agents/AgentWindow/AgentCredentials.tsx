import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Avatar,
  AvatarImage,
  AvatarFallback,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@magickml/client-ui'
import credentialsJson from 'packages/shared/nodeSpec/src/credentials.json'
import { FC, useEffect, useState } from 'react'
import {
  AgentCredential,
  Credential,
  useListCredentialsQuery,
  useListAgentCredentialsQuery,
  useLinkAgentCredentialMutation,
  useUnlinkCredentialFromAgentMutation,
  useUpdateAgentMutation,
  useGetUserQuery,
} from 'client/state'
import { useConfig, useTabLayout } from '@magickml/providers'
import clsx from 'clsx'

import {
  Model,
  getProvidersWithUserKeys,
  groupModelsByProvider,
  isModelAvailableToUser,
} from 'servicesShared'

import { Dropdown } from '@magickml/client-ui'
import posthog from 'posthog-js'

type PluginCredential = {
  name: string
  serviceType: string
  credentialType: 'core' | 'plugin' | 'custom'
  clientName?: string
  initials: string
  description?: string
  icon?: string
  helpLink?: string
  available: boolean
}

// Function to separate credentials into core+plugin and custom
function separateCredentials(
  credentials: Credential[]
): [Credential[], Credential[]] {
  const corePluginCredentials = credentials.filter(
    c => c.credentialType === 'core' || c.credentialType === 'plugin'
  )
  const customCredentials = credentials.filter(
    c => c.credentialType === 'custom'
  )
  return [corePluginCredentials, customCredentials]
}

// Function to check if there is a linked AgentCredential for a given Credential name
function hasLinkedAgentCredential(
  name: string,
  credentials?: Credential[],
  agentCredentials?: AgentCredential[]
): boolean {
  if (!credentials || !agentCredentials) return false
  const c = credentials.find(credential => credential.name === name)
  if (!c) return false
  return agentCredentials.some(ac => ac.credentialId === c?.id)
}

// Function to find credentials that match a given PluginCredential name
function findMatchingCredentials(
  pluginCredential: PluginCredential,
  credentials?: Credential[]
): Credential[] {
  if (!credentials) return []
  return credentials.filter(
    credential => credential.name === pluginCredential.name
  )
}

function findMatchingAgentCredential(
  pluginCredential: PluginCredential,
  credentials?: Credential[],
  agentCredentials?: AgentCredential[]
): AgentCredential | undefined {
  if (!credentials || !agentCredentials) return undefined
  const c = credentials.find(
    credential => credential.name === pluginCredential.name
  )
  if (!c) return undefined
  return agentCredentials.find(ac => ac.credentialId === c?.id)
}

const Header = ({ agentId }: { agentId: string }): JSX.Element => {
  const { openTab } = useTabLayout()
  const [selectedEmbeddingProvider, setSelectedEmbeddingProvider] =
    useState<string>('')
  const [activeEmbeddingModels, setActiveEmbeddingModels] = useState<Model[]>(
    []
  )
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState<string>()
  const [providersWithUserKeys, setProvidersWithUserKeys] = useState<
    Record<string, { models: Model[]; apiKey: string }>
  >({})
  const [providerData, setProviderData] = useState<
    Record<string, { models: Model[]; apiKey: string }>
  >({})
  const config = useConfig()

  const { data: credentials } = useListCredentialsQuery({
    projectId: config.projectId,
  })

  const { data: userData } = useGetUserQuery({
    projectId: config.projectId,
  })

  const [updateAgent] = useUpdateAgentMutation()

  useEffect(() => {
    if (!providerData) return

    setProvidersWithUserKeys(
      getProvidersWithUserKeys(providerData, credentials || [])
    )
  }, [credentials, providerData])

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          'https://api.keywordsai.co/api/models/public'
        )
        const data = await response.json()
        const { models } = data
        const groupedModels = groupModelsByProvider(models)

        setProviderData(groupedModels)
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    }

    fetchModels()
  }, [])

  useEffect(() => {
    setActiveEmbeddingModels(
      providerData[selectedEmbeddingProvider].models || []
    )
  }, [selectedEmbeddingProvider])

  useEffect(() => {
    if (userData) {
      const provider = userData.embeddingProvider
      const model = userData.embeddingModel
      setSelectedEmbeddingProvider(provider)
      setSelectedEmbeddingModel(model)
    }
  }, [userData])

  const openSecrets = () => {
    openTab({
      id: 'Secrets',
      name: 'Secrets',
      type: 'Secrets',
      switchActive: true,
    })
  }

  const handleEmbeddingProviderChange = (provider: string) => {
    setSelectedEmbeddingProvider(provider)
    updateAgent({
      id: agentId,
      embeddingProvider: provider,
    })
  }

  const handleEmbeddingModelChange = (model: string) => {
    setSelectedEmbeddingModel(model)
    updateAgent({
      id: agentId,
      embeddingModel: model,
    })
  }

  const modelOptions = activeEmbeddingModels.map(model => {
    const isAvailable = isModelAvailableToUser({
      userData,
      model: model,
      providersWithUserKeys,
    })
    return {
      value: model.model_name,
      label: model.display_name,
      disabled: !isAvailable,
    }
  })

  return (
    <div className="pt-8 pb-4">
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-col mt-1">
          <h3>Embedding Provider</h3>
          <Dropdown
            options={Object.keys(providerData).map(provider => ({
              value: provider,
              label: provider,
            }))}
            selectedValue={selectedEmbeddingProvider}
            onChange={value => handleEmbeddingProviderChange(value)}
            placeholder="Select a provider"
          />
        </div>
        <div className="mt-4">
          <h3>Embedding Model</h3>
          <div className="flex flex-col mt-1">
            <Dropdown
              options={modelOptions}
              selectedValue={selectedEmbeddingModel || ''}
              onChange={value => handleEmbeddingModelChange(value)}
              placeholder="Select a model"
            />
          </div>
        </div>
        <br />
        <div className="inline-flex items-center space-x-2">
          <h2>Linked Secrets</h2>
          <Button variant="outline" size="sm" onClick={openSecrets}>
            Create New
          </Button>
        </div>
        <p>
          You can link secrets to your agent to use in your spells and connect
          to external services. Click the button above to open the secrets
          window.
        </p>
      </div>
    </div>
  )
}

interface CredentialActionProps {
  projectId: string
  agentId: string
  linkedCredential?: AgentCredential
  availableCredentials: Credential[]
  children?: React.ReactNode
  custom?: boolean
  customId?: string
}

const CredentialAction: FC<CredentialActionProps> = ({
  projectId,
  agentId,
  linkedCredential,
  availableCredentials,
  children,
  custom = false,
  customId,
}) => {
  const [open, onOpenChange] = useState(false)
  const isLinked = linkedCredential && !!linkedCredential.credentialId
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    string | null
  >(null)

  const [linkAgentCredential] = useLinkAgentCredentialMutation()
  const [unlinkCredentialFromAgent] = useUnlinkCredentialFromAgentMutation()

  const handleSelect = (credentialId: string) => {
    setSelectedCredentialId(credentialId)
  }

  const handleLink = async () => {
    if (!custom && !selectedCredentialId) return
    try {
      await linkAgentCredential({
        projectId: projectId,
        agentId: agentId,
        credentialId: custom
          ? (customId as string)
          : selectedCredentialId || '',
      })

      posthog.capture('agent_linked_credential', {
        agentId,
        credentialId: custom ? customId : selectedCredentialId,
      })
      onOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleUnlink = async () => {
    if (!isLinked || !linkedCredential) return
    try {
      await unlinkCredentialFromAgent({
        projectId: projectId,
        agentId: linkedCredential.agentId,
        credentialId: linkedCredential.credentialId,
      })
      onOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAction = async () => {
    isLinked ? await handleUnlink() : onOpenChange(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button onClick={handleAction} variant="outline">
        {isLinked ? 'Unlink' : 'Link'}
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`${isLinked ? 'Unlink' : 'Link'} ${
            custom && ' Custom'
          } Credential`}</DialogTitle>
          {!custom && (
            <DialogDescription className="text-ds-white">
              Select a credential to {isLinked ? 'unlink' : 'link'} to this
              agent.
            </DialogDescription>
          )}
        </DialogHeader>

        {!custom ? (
          <div className="py-4">
            {availableCredentials?.length > 0 ? (
              <Select onValueChange={handleSelect}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Credential" />
                </SelectTrigger>
                <SelectContent>
                  {availableCredentials.map(credential => (
                    <SelectItem key={credential.id} value={credential.id}>
                      {`${credential.name} - ${new Date(
                        credential.created_at
                      ).toLocaleDateString()}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p>
                Create a secret for this platform in the secrets window to link
                to this agent
              </p>
            )}

            {selectedCredentialId && (
              <p className="mt-2 text-sm text-white/80">
                {availableCredentials.find(c => c.id === selectedCredentialId)
                  ?.description || 'No description'}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p>When linked you can access this secret in the getSecret node.</p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleLink}
            disabled={custom ? false : !selectedCredentialId}
          >
            Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CredentialItemProps {
  action?: React.ReactNode
  isLinked: boolean
  credential: PluginCredential
}

const CredentialItem: FC<CredentialItemProps> = ({
  action,
  isLinked,
  credential,
}) => {
  return (
    <div className="flex items-center justify-between space-x-4 border-2 border-white/10 rounded-sm p-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={credential.icon} alt={credential.clientName} />
          <AvatarFallback>{credential.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold leading-none">
            {credential.clientName}
          </p>
          <p className="text-sm">{credential.description}</p>
          <p
            className={clsx(
              isLinked ? 'text-green-500' : 'text-gray-500',
              'text-sm'
            )}
          >
            {isLinked ? 'Linked' : 'Not Linked'}
          </p>
          {credential?.helpLink && (
            <a
              className="text-sm text-blue-500"
              href={credential.helpLink}
              target="_blank"
              rel="noreferrer"
              aria-label="Learn more"
            >
              Learn more
            </a>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}

type CredentialProps = {
  agentId: string
}

export const Credentials: FC<CredentialProps> = ({ agentId }) => {
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
      <div className="inline-flex w-full justify-between items-center space-x-2">
        <Header agentId={agentId} />
      </div>
      {/* Plugin Credentials */}
      <div className="grid grid-cols-2 gap-6">
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
      <div className="mt-8">
        <h2>Custom Credentials</h2>
        <p>
          Custom credentials are secrets that you create in the secrets window
          and link to this agent.
        </p>
        <div className="grid grid-cols-2 gap-6">
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

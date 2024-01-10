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
  DialogTrigger,
} from '@magickml/ui'
import credentialsJson from 'packages/shared/nodeSpec/src/credentials.json'
import { FC, useState } from 'react'
import {
  AgentCredential,
  Credential,
  useListCredentialsQuery,
  useListAgentCredentialsQuery,
  useLinkAgentCredentialMutation,
  useUnlinkCredentialFromAgentMutation,
} from 'client/state'
import { useConfig, useTabLayout } from '@magickml/providers'
import clsx from 'clsx'

type PluginCredential = {
  name: string
  serviceType: string
  credentialType: 'core' | 'plugin' | 'custom'
  clientName?: string
  initials: string
  description?: string
  icon?: string
  helpLink?: string
}

const Header: FC = () => {
  const { openTab } = useTabLayout()

  const openSecrets = () => {
    openTab({
      id: 'Secrets',
      name: 'Secrets',
      type: 'Secrets',
      switchActive: true,
    })
  }

  return (
    <div className="pt-8 pb-4">
      <div className="flex flex-col gap-y-1">
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
  isLinked: boolean
  linkedCredentialId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceType: string
  availableCredentials: Credential[]
}
const CredentialAction: FC<CredentialActionProps> = ({
  projectId,
  agentId,
  isLinked,
  open,
  onOpenChange,
  serviceType,
  availableCredentials,
  linkedCredentialId,
}) => {
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    string | null
  >(null)
  const [linkAgentCredential] = useLinkAgentCredentialMutation()
  const [unlinkCredentialFromAgent] = useUnlinkCredentialFromAgentMutation()

  const handleSelect = (credentialId: string) => {
    setSelectedCredentialId(credentialId)
  }

  const handleLink = async () => {
    try {
      await linkAgentCredential({
        projectId: projectId,
        agentId: agentId,
        credentialId: selectedCredentialId || '',
      })
      onOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleUnlink = async () => {
    if (!linkedCredentialId) return
    try {
      await unlinkCredentialFromAgent({
        projectId: projectId,
        agentId: agentId,
        credentialId: linkedCredentialId || '',
      })
      onOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAction = async () => {
    isLinked ? await handleUnlink() : onOpenChange(true)
  }

  const filteredCredentials = availableCredentials.filter(
    c => c.serviceType === serviceType
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button onClick={handleAction} variant="outline">
        {isLinked ? 'Unlink' : 'Link'}
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLinked ? 'Unlink' : 'Link'} Credential</DialogTitle>
          <DialogDescription>
            Select a credential to {isLinked ? 'unlink' : 'link'} to this agent.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Credential" />
            </SelectTrigger>
            <SelectContent>
              {filteredCredentials.map(credential => (
                <SelectItem key={credential.id} value={credential.id}>
                  {`${credential.name} - ${new Date(
                    credential.created_at
                  ).toLocaleDateString()}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCredentialId && (
            <p className="mt-2 text-sm text-gray-500">
              {availableCredentials.find(c => c.id === selectedCredentialId)
                ?.description || 'No description'}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={handleLink}>
            Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CredentialItemProps {
  credential: PluginCredential
  agentId: string
  c: Credential[]
  ac: AgentCredential[]
  isLinked?: boolean
  linkedCredentialId?: string
}

const CredentialItem: FC<CredentialItemProps> = ({
  credential,
  agentId,
  isLinked,
  linkedCredentialId,
  c,
}) => {
  const config = useConfig()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-between space-x-4 border border-white">
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
      <CredentialAction
        projectId={config.projectId}
        agentId={agentId}
        isLinked={isLinked}
        linkedCredentialId={linkedCredentialId}
        open={open}
        onOpenChange={setOpen}
        serviceType={credential.serviceType}
        availableCredentials={c}
      />
    </div>
  )
}

type CredentialProps = {
  agentId: string
}

export const Credentials: FC<CredentialProps> = ({ agentId }) => {
  const pluginCredentials: PluginCredential[] =
    credentialsJson as PluginCredential[]
  const config = useConfig()
  const { data: c, isLoading: cLoading } = useListCredentialsQuery({
    projectId: config.projectId,
  })

  const { data: ac, isLoading: acLoading } = useListAgentCredentialsQuery({
    projectId: config.projectId,
    agentId,
  })

  // find credentials where credentialType is not "custom" and serviceType is a parameter
  const findPluginCredentials = (serviceType: string) => {
    return c.find(
      (credential: Credential) =>
        credential.serviceType === serviceType &&
        credential.credentialType !== 'custom'
    )
  }

  const isLinked = (credentialId: string) => {
    return ac.some(
      (agentCredential: AgentCredential) =>
        agentCredential.credentialId === credentialId
    )
  }

  // cross refernece both c and ac and a serviceType to see find the credential id that is linked to the agent
  const linkedCredentialId = (serviceType: string) => {
    return ac.find(
      (agentCredential: AgentCredential) =>
        agentCredential.credentialId === findPluginCredentials(serviceType)?.id
    )?.credentialId
  }

  return (
    <>
      <div className="inline-flex w-full justify-between items-center space-x-2">
        <Header />
      </div>
      <div className="grid gap-6">
        {c &&
          pluginCredentials?.map(p => (
            <CredentialItem
              key={p.name}
              credential={p}
              linkedCredentialId={
                ac ? linkedCredentialId(p.serviceType) : undefined
              }
              isLinked={
                ac ? isLinked(findPluginCredentials(p.serviceType)?.id) : false
              }
              agentId={agentId}
              c={c}
              ac={ac}
            />
          ))}
      </div>
    </>
  )
}

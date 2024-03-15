import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@magickml/client-ui'
import { FC, useState } from 'react'
import {
  AgentCredential,
  Credential,
  useLinkAgentCredentialMutation,
  useUnlinkCredentialFromAgentMutation,
} from 'client/state'

interface CredentialActionProps {
  projectId: string
  agentId: string
  linkedCredential?: AgentCredential
  availableCredentials: Credential[]
  children?: React.ReactNode
  custom?: boolean
  customId?: string
}

export const CredentialAction: FC<CredentialActionProps> = ({
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
      <Button size="sm" onClick={handleAction} className='uppercase px-4 rounded-sm' variant="portal-neutral">
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

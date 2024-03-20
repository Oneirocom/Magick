import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@magickml/client-ui'
import { FC, useState } from 'react'
import {
  Credential,
  useLinkAgentCredentialMutation,
  useUnlinkCredentialFromAgentMutation,
  useCreateCredentialMutation,
} from 'client/state'
import { NewCredentialContent } from './new-credential-content'
import { ExistingCredentialContent } from './existing-credential-content'
import {
  CredentialDialogContent,
  CredentialDialogTab,
} from './credentials-dialog-content'
import toast from 'react-hot-toast'
import { type FindCredentialIdReturn } from '../utils'

interface CredentialsDialogProps {
  projectId: string
  agentId: string
  agentSecret: FindCredentialIdReturn
  projectSecrets: Credential[]
  custom?: boolean
  clientName: string
  credName: string
  isCore?: boolean
  serviceType: string
  pluginName: string
}

export const CredentialsDialog: FC<CredentialsDialogProps> = ({
  projectId,
  agentId,
  agentSecret,
  projectSecrets,
  custom = false,
  isCore = false,
  credName,
  clientName,
  serviceType,
  pluginName,
}) => {
  const tab = useState<CredentialDialogTab>(CredentialDialogTab.NEW)
  const [open, onOpenChange] = useState(false)
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    string | null
  >(null)
  const [newCredentialName, setNewCredentialName] = useState('')
  const [newCredentialDescription, setNewCredentialDescription] = useState('')
  const [newCredentialValue, setNewCredentialValue] = useState('')

  const resetForm = () => {
    setNewCredentialName('')
    setNewCredentialDescription('')
    setNewCredentialValue('')
  }

  const isUnique = (name: string) => {
    if (projectSecrets) {
      const customCreds = projectSecrets.filter(
        cred => cred.serviceType === 'custom'
      )
      const names = customCreds.map(cred => cred.name)
      return !names.includes(name)
    }
    return true
  }

  const [linkAgentCredential, linkState] = useLinkAgentCredentialMutation()
  const [unlinkCredentialFromAgent, unlinkState] =
    useUnlinkCredentialFromAgentMutation()
  const [createCredential, createState] = useCreateCredentialMutation()

  const handleLink = async (credentialId: string) => {
    try {
      await linkAgentCredential({
        projectId: projectId,
        agentId: agentId,
        credentialId,
      })
      onOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleUnlink = async () => {
    if (agentSecret?.credentialId === undefined) return
    console.log('!!!Credentialid', agentSecret?.credentialId)
    try {
      await unlinkCredentialFromAgent({
        projectId: projectId,
        agentId,
        credentialId: agentSecret.credentialId,
      })
      onOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleCreateAndLink = async () => {
    if (custom && !isUnique(newCredentialName)) {
      toast.error('Custom secrets must have unique names.')
      return
    }
    try {
      const credential = await createCredential({
        projectId,
        name: custom ? newCredentialName : credName,
        serviceType: custom ? 'custom' : serviceType,
        credentialType: custom ? 'custom' : isCore ? 'core' : 'plugin',
        description: newCredentialDescription,
        value: newCredentialValue,
        pluginName: custom ? undefined : pluginName,
      }).unwrap()
      resetForm()

      console.log('Created credential:', credential)

      await handleLink(credential.id)
    } catch (error) {
      console.error('Error creating credential:', error)
    }
  }

  const handleAction = async () => {
    agentSecret?.credentialId ? await handleUnlink() : onOpenChange(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button
        size="sm"
        onClick={handleAction}
        className="uppercase px-4 rounded-sm gap-x-1"
        variant="portal-neutral"
        disabled={
          linkState.isLoading || unlinkState.isLoading || createState.isLoading
        }
      >
        {agentSecret?.credentialId ? 'Unlink' : 'Link'}
        {(linkState.isLoading ||
          unlinkState.isLoading ||
          createState.isLoading) && (
          <span className="loading loading-spinner loading-xs text-white" />
        )}
      </Button>
      <DialogContent className="sm:max-w-[425px] min-h-40">
        <DialogHeader>
          <DialogTitle>{`${isCore ? credName : clientName}`}</DialogTitle>
        </DialogHeader>
        {selectedCredentialId}
        <CredentialDialogContent
          state={tab}
          newContent={
            <NewCredentialContent
              name={newCredentialName}
              setName={setNewCredentialName}
              description={newCredentialDescription}
              setDescription={setNewCredentialDescription}
              value={newCredentialValue}
              setValue={setNewCredentialValue}
              isCustom={custom}
            />
          }
          existingContent={
            <ExistingCredentialContent
              availableCredentials={projectSecrets.filter(
                cred => cred.serviceType === serviceType
              )}
              selectedCredentialId={selectedCredentialId}
              setSelectedCredentialId={setSelectedCredentialId}
            />
          }
        />

        <DialogFooter>
          <Button
            className="gap-x-1"
            variant="outline"
            disabled={createState.isLoading || linkState.isLoading}
            onClick={() => {
              selectedCredentialId
                ? handleLink(selectedCredentialId)
                : handleCreateAndLink()
            }}
          >
            {tab[0] === CredentialDialogTab.NEW ? 'Create and Link' : 'Link'}
            {(createState.isLoading || linkState.isLoading) && (
              <span className="loading loading-spinner loading-xs text-white" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

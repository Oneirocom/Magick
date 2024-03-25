import { FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Button,
  Textarea,
} from '@magickml/client-ui'
import { useCreateCredentialMutation } from 'client/state'
import { getPluginCredentials } from 'shared/nodeSpec'
import { ServiceSelector } from './ServiceSelector'

const pluginCredentials = getPluginCredentials()

interface Credential {
  id: string
  projectId: string
  name: string
  serviceType: string
  credentialType: string
  description: string | null
  created_at: string | Date
  updated_at: string | Date
}

interface CreateCredentialProps {
  projectId: string
  currentCreds?: Credential[]
}

export const CreateCredential: FC<CreateCredentialProps> = ({
  projectId,
  currentCreds,
}) => {
  const [createCredential, { isLoading: createLoading }] =
    useCreateCredentialMutation()
  const [name, setName] = useState('')
  const [serviceType, setServiceType] = useState<string>(
    pluginCredentials[0].clientName
  )
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')

  // check if custom credential name is unique where .credentialType === 'custom'
  const isUnique = (name: string) => {
    if (currentCreds) {
      const customCreds = currentCreds.filter(
        cred => cred.credentialType === 'custom'
      )
      const names = customCreds.map(cred => cred.name)
      return !names.includes(name)
    }
    return true
  }

  const serviceTypeByName = (name: string) => {
    return pluginCredentials.find(credential => credential.clientName === name)
  }

  const resetForm = () => {
    setName('')
    setServiceType(pluginCredentials[0].clientName)
    setDescription('')
    setValue('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await createCredential({
        projectId,
        name:
          serviceType === 'custom'
            ? name
            : serviceTypeByName(serviceType)?.name,
        serviceType:
          serviceType === 'custom'
            ? 'custom'
            : serviceTypeByName(serviceType)?.serviceType,
        credentialType: serviceType === 'custom' ? 'custom' : 'plugin',
        description,
        value,
        pluginName:
          serviceType === 'custom'
            ? undefined
            : serviceTypeByName(serviceType)?.pluginName,
      }).unwrap()
      resetForm()
    } catch (error) {
      console.error('Error creating credential:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="portal-neutral">Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Secret</DialogTitle>
          <DialogDescription>
            Enter the details for your new Secret.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 w-full">
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="serviceType" className="text-right">
              Type
            </Label>
            <ServiceSelector
              selectedService={serviceType}
              setSelectedService={setServiceType}
              pluginCredentials={pluginCredentials}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Value
            </Label>
            <Input
              id="name"
              type="password"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="col-span-3 bg-ds-card-alt"
              required
              placeholder="Enter the value of your secret."
            />
          </div>

          {serviceType === 'custom' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="col-span-3 bg-ds-card-alt"
                required={serviceType === 'custom'}
                placeholder="You can use this name to reference this secret in your spell."
              />
              {!isUnique(name) && (
                <span className="text-sm text-red-500 col-span-4">
                  You already have a custom secret with this name.
                </span>
              )}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3 bg-ds-card-alt"
              placeholder="Set a description so you can remember what this secret is for."
            />
          </div>
          <DialogFooter>
            <Button
              variant="portal-neutral"
              type="submit"
              className="uppercase"
              disabled={
                createLoading || (serviceType === 'custom' && !isUnique(name))
              }
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

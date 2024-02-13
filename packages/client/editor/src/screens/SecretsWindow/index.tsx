import { FC, useState } from 'react'
import { useConfig, useTabLayout } from '@magickml/providers'
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
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  CredentialsTable,
  columns,
} from '@magickml/client-ui'
import {
  useListCredentialsQuery,
  useCreateCredentialMutation,
} from 'client/state'
import { getPluginCredentials } from 'shared/nodeSpec'

const pluginCredentials = getPluginCredentials()

interface Credential {
  id: string
  projectId: string
  name: string
  serviceType: string
  credentialType: string
  description: string | null
  created_at: string
  updated_at: string
}

const SecretWindow: FC = () => {
  const config = useConfig()
  const { openTab } = useTabLayout()

  const openConfigWindow = () => {
    openTab({
      id: 'Config',
      name: 'Config',
      type: 'Config',
      switchActive: true,
    })
  }

  const { data: credentials, isLoading } = useListCredentialsQuery({
    projectId: config.projectId,
  })

  if (isLoading || !credentials) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="inline-flex w-full justify-between items-center space-x-2 p-8">
        <Header sortType={'All'} />
        <CreateCredential
          projectId={config.projectId}
          currentCreds={credentials}
        />
        <Button variant="outline" onClick={openConfigWindow}>
          Link
        </Button>
      </div>
      <div className="grid gap-6 p-8">
        <CredentialsTable columns={columns} data={credentials} />
      </div>
    </div>
  )
}

interface HeaderProps {
  sortType: string
}

const Header: FC<HeaderProps> = ({ sortType }) => {
  return (
    <div className="pt-8 pb-4">
      <div className="flex flex-col gap-y-1">
        <div className="inline-flex items-center space-x-2">
          <h2>Your Secrets</h2>
        </div>
        <p>
          Here you can create and manage your secrets. Secrets are encrypted and
          stored in your project. When you're ready to use them, click the
          button above to go to the Config Window and link them to your agent.
        </p>
      </div>
    </div>
  )
}

interface CreateCredentialProps {
  projectId: string
  currentCreds?: Credential[]
}

const CreateCredential: FC<CreateCredentialProps> = ({
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
        serviceType: serviceType === 'custom' ? 'custom' : serviceType,
        credentialType: serviceType === 'custom' ? 'custom' : 'plugin',
        description,
        value,
      }).unwrap()
      resetForm()
    } catch (error) {
      console.error('Error creating credential:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
              className="col-span-3"
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
                className="col-span-3"
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
              className="col-span-3"
              placeholder="Set a description so you can remember what this secret is for."
            />
          </div>
          <DialogFooter>
            <Button
              className="text-white"
              type="submit"
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

const ServiceSelector = ({ selectedService, setSelectedService }) => {
  const groupedServices = pluginCredentials.reduce((acc, service) => {
    acc[service.clientName] = acc[service.clientName] || []
    if (service.available) acc[service.clientName].push(service)
    return acc
  }, {}) as Record<string, typeof pluginCredentials>

  return (
    <div className="flex items-center w-full col-span-3">
      {pluginCredentials.length > 0 && (
        <Select onValueChange={setSelectedService} value={selectedService}>
          <SelectTrigger className="w-[180px] border-white/20">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent className="bg-[#2b2b30]">
            {Object.keys(groupedServices).map(service =>
              groupedServices[service].map(service => (
                <SelectItem
                  key={service.name}
                  value={service.clientName}
                  className="hover:bg-white/20 focus:bg-white/20"
                >
                  <div className="inline-flex gap-x-0.5 items-center justify-center">
                    <img alt="" src={service.icon} className="w-4 h-4 mr-2" />
                    {service.clientName}
                  </div>
                </SelectItem>
              ))
            )}
            <SelectSeparator />
            <SelectItem
              className="hover:bg-white/20 focus:bg-white/20"
              value="custom"
            >
              Custom
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

export default SecretWindow

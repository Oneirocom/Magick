import { Tooltip } from 'client/core'
import { pluginManager } from 'shared/core'
import { Clear } from '@mui/icons-material/'
import { IconButton, Input, Button } from '@mui/material'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { useCreateCredentialMutation } from 'client/state'
import { ChangeEvent } from 'react'

type Props = {}

const CredentialsWindow = (props: Props): JSX.Element => {
  const [createCredential, { data: createdCredential, isLoading }] =
    useCreateCredentialMutation()

  const [formData, setFormData] = useState({
    name: '',
    serviceType: '',
    credentialType: 'oauth',
    value: '',
    description: '',
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log(formData)
    event.preventDefault()
    await createCredential(formData).then(response => {
      console.log('Created Credential')
      console.log(response)
    })
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Credential</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Credential Name"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          placeholder="Service Type"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          name="credentialType"
          value={formData.credentialType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="oauth">OAuth</option>
          <option value="key">Key</option>
        </select>
        <input
          type="text"
          name="value"
          value={formData.value}
          onChange={handleChange}
          placeholder="Credentials Data"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Credential'}
        </button>
      </form>
      {createdCredential && (
        <div className="mt-4 p-2 bg-green-200 rounded">
          <strong>Created Credential:</strong>
          <pre className="overflow-x-auto">
            {JSON.stringify(createdCredential, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default CredentialsWindow

import { FC } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'
import { Credential } from 'client/state'

interface ExistingCredentialContentProps {
  availableCredentials: Credential[]
  selectedCredentialId: string | null
  setSelectedCredentialId: (credentialId: string | null) => void
}

export const ExistingCredentialContent: FC<ExistingCredentialContentProps> = ({
  availableCredentials,
  selectedCredentialId,
  setSelectedCredentialId,
}) => {
  return (
    <div className="">
      {availableCredentials?.length > 0 ? (
        <Select onValueChange={value => setSelectedCredentialId(value)}>
          <SelectTrigger className="w-full border-white/20">
            <SelectValue placeholder="Select a Credential" />
          </SelectTrigger>
          <SelectContent>
            {availableCredentials.map(credential => (
              <SelectItem
                className="text-ellipsis"
                key={credential.id}
                value={credential.id}
              >
                {`${credential.name} - ${new Date(
                  credential.created_at
                ).toLocaleDateString()} - ${
                  credential.description?.substring(0, 10).concat('...') ||
                  'No description'
                }`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p>No credentials available. Please create a new credential to use.</p>
      )}

      {selectedCredentialId && (
        <p className="mt-2 text-sm text-white/80">
          {availableCredentials.find(c => c.id === selectedCredentialId)
            ?.description || ''}
        </p>
      )}
    </div>
  )
}

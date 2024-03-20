import { FC } from 'react'
import { Input, Label, Textarea } from '@magickml/client-ui'

interface NewCredentialContentProps {
  name: string
  setName: (name: string) => void
  description: string
  setDescription: (description: string) => void
  value: string
  setValue: (value: string) => void
  isCustom?: boolean
}

export const NewCredentialContent: FC<NewCredentialContentProps> = ({
  name,
  setName,
  description,
  setDescription,
  value,
  setValue,
  isCustom = false,
}) => {
  return (
    <div className="grid gap-4 py-4 w-full">
      {isCustom && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="col-span-3 bg-ds-card-alt"
            required
            placeholder="You can use this name to reference this secret in your spell."
          />
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="value" className="text-right">
          Value
        </Label>
        <Input
          id="value"
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="col-span-3 bg-ds-card-alt"
          required
          placeholder="Enter the value of your secret."
        />
      </div>
    </div>
  )
}

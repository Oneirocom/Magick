import { Avatar, AvatarImage, AvatarFallback } from '@magickml/client-ui'
import { FC } from 'react'
import clsx from 'clsx'
import {
  type FindCredentialIdReturn,
  type PluginCredential,
} from './utils'

export interface CredentialItemProps {
  action?: React.ReactNode
  credential: PluginCredential
  status: FindCredentialIdReturn
}

export const CredentialItem: FC<CredentialItemProps> = ({
  action,
  credential,
  status,
}) => {
  return (
    <div className="inline-flex items-center justify-start space-x-4 border-2 bg-[#282d33] border-white/10 rounded-sm p-4 h-24">
      <Avatar>
        <AvatarImage src={credential.icon} alt={credential.clientName} />
        <AvatarFallback>{credential.initials}</AvatarFallback>
      </Avatar>
      <div className="flex items-start gap-y-[2px] h-full flex-col">
        <p className="text-xs font-semibold leading-none">
          {credential.clientName}
        </p>
        <p className="text-xs">{credential.description}</p>
        <p
          className={clsx(
            status.linked ? 'text-green-500' : 'text-white/60',
            'text-sm'
          )}
        >
          {status.linked ? 'Linked' : 'Not Linked'}
        </p>
        {credential?.helpLink && (
          <a
            className="text-xs text-normal link text-ds-primary-m"
            href={credential.helpLink}
            target="_blank"
            rel="noreferrer"
            aria-label="Learn more"
          >
            Learn how to get this
          </a>
        )}
      </div>
      <div className="grow" />
      {action}
    </div>
  )
}

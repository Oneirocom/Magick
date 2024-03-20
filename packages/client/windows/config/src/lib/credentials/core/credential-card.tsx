import { FC } from 'react'
import {
  CredentialCardContent,
  CredentialCardContentProps,
} from './credential-card-content'
import { type FindCredentialIdReturn, type PluginCredential } from '../utils'

export interface CredentialCardProps {
  action?: React.ReactNode
  credential: PluginCredential
  status: FindCredentialIdReturn
}

export const CredentialCard: FC<CredentialCardProps> = ({
  action,
  credential,
  status,
}) => {
  const contentProps: CredentialCardContentProps = {
    credential,
    status,
  }

  return (
    <div className="inline-flex items-center justify-start space-x-4 border-2 bg-[#282d33] border-white/10 rounded-sm p-4 h-24">
      <CredentialCardContent {...contentProps} />
      <div className="grow" />
      {action}
    </div>
  )
}

import { FC } from 'react'
import clsx from 'clsx'
import { type CredentialCardProps } from '../core/credential-card'

interface PluginCredentialCardContentProps {
  credentials: CredentialCardProps[]
}

export const PluginCredentialCardContent: FC<
  PluginCredentialCardContentProps
> = ({ credentials }) => {
  return (
    <div className="flex flex-col w-full gap-y-4 divide-y-[0.5px] divide-white/10 pt-2">
      {credentials.map((c, i) => (
        <div
          key={i}
          className="items-center w-full gap-y-[2px] h-full inline-flex pt-2"
        >
          <div className="flex items-start gap-y-[2px] h-full flex-col">
            <p className="text-xs font-semibold leading-none">
              {c.credential.clientName}
            </p>
            <p className="text-xs">{c.credential.description}</p>
            <p
              className={clsx(
                c.status.linked ? 'text-green-500' : 'text-white/60',
                'text-sm'
              )}
            >
              {c.status.linked ? 'Linked' : 'Not Linked'}
            </p>
            {c.credential?.helpLink && (
              <a
                className="text-xs text-normal link text-ds-primary-m"
                href={c.credential.helpLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Learn more"
              >
                Learn how to get this
              </a>
            )}
          </div>
          <div className="grow" />
          {c.action}
        </div>
      ))}
    </div>
  )
}

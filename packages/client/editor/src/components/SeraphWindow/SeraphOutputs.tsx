import {
  InfoIcon,
  Error as ErrorIcon,
  Seraph,
  Ouroboros,
} from '@magickml/icons'

import { SeraphFunction } from 'servicesShared'

export const Info = (message: string): JSX.Element => {
  return (
    <div className="absolute inline-flex items-center justify-center font-medium cursor-pointer right-7 opacity-50">
      <InfoIcon />
      <div
        className={`rounded p-2 text-white flex-1 text-sm font-mono whitespace-pre-line bg-[--ds-black]`}
      >
        {message}
      </div>
    </div>
  )
}

export const Error = (message: string): JSX.Element => {
  return (
    <div className="absolute inline-flex items-center justify-center font-medium cursor-pointer right-7 opacity-50">
      <ErrorIcon />
      <div
        className={`rounded p-2 text-white flex-1 text-sm font-mono whitespace-pre-line bg-[--ds-black]`}
      >
        {message}
      </div>
    </div>
  )
}

export const Response = (message: string): JSX.Element => {
  return (
    <div className="absolute inline-flex items-center justify-center font-medium cursor-pointer right-7 opacity-50">
      <div className="flex items-center space-x-2 w-full">
        <Seraph width={32} height={32} fill={'#fdffff'} />
      </div>
      <div
        className={`rounded p-2 text-white flex-1 text-sm font-mono whitespace-pre-line bg-[--ds-black]`}
      >
        {message}
      </div>
    </div>
  )
}

export const FunctionStart = ({
  icon,
  message,
  messageTitle,
}: SeraphFunction): JSX.Element => {
  return (
    <div className="absolute inline-flex items-center justify-center font-medium cursor-pointer right-7 opacity-50">
      <div className="flex items-center space-x-2 w-full">
        {icon ? (
          icon
        ) : (
          <div>
            <Seraph width={32} height={32} fill={'#fdffff'} />
            <Ouroboros width={32} height={32} fill={'#1bc5eb'} />
          </div>
        )}
      </div>
      <div>{messageTitle}</div>
      <div
        className={`rounded p-2 text-white flex-1 text-sm font-mono whitespace-pre-line bg-[--ds-black]`}
      >
        {message}
      </div>
    </div>
  )
}

export const FunctionEnd = ({
  icon,
  message,
  messageTitle,
}: // result,
SeraphFunction): JSX.Element => {
  return (
    <div className="absolute inline-flex items-center justify-center font-medium cursor-pointer right-7 opacity-50">
      <div className="flex items-center space-x-2 w-full">
        {icon ? (
          icon
        ) : (
          <div>
            <Seraph width={32} height={32} fill={'#fdffff'} />
            <Ouroboros width={32} height={32} fill={'#fdffff'} />
          </div>
        )}
      </div>
      <div>{messageTitle}</div>
      <div
        className={`rounded p-2 text-white flex-1 text-sm font-mono whitespace-pre-line bg-[--ds-black]`}
      >
        {message}
      </div>
    </div>
  )
}

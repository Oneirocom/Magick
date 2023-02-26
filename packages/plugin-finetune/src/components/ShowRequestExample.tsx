import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import ExpansionDetails from './ExpansionDetails'

export default function ShowRequestExample({
  reference,
  request,
}: {
  reference: string
  request: {
    url: string
    method: string
    headers: { [key: string]: string }
    body: { [key: string]: string | string[] | number | boolean | undefined }
  }
}) {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)
  const code = JSON.stringify(request, null, 2)

  return (
    <ExpansionDetails title={'Request JSON'}>
      <div className="relative prose">
        <Tooltip
          className="absolute top-0 right-0 p-2"
          title={copied ? 'Copied!' : 'Click to copy'}
          placement="left"
          onClose={() => setCopied(false)}
          onClick={async () => {
            await copy(code)
            setCopied(true)
          }}
        >
          <></>
        </Tooltip>
        <pre>{code}</pre>
      </div>
      <p>
        <a href={reference} target="_blank">
          OpenAI Reference
        </a>
      </p>
    </ExpansionDetails>
  )
}

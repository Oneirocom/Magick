import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import InfoCard from './InfoCard'
import Button from '@mui/material/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
export function MetadataCard({
  fields,
}: {
  fields: Array<{
    label: string
    value?: string | number | Date | null
    clickToCopy?: boolean
  }>
}) {
  return (
    <InfoCard>
      {fields
        .map(({ clickToCopy, label, value }) => ({
          clickToCopy,
          label,
          value:
            value instanceof Date
              ? value.toLocaleString()
              : String(value ?? ''),
        }))
        .map(({ clickToCopy, label, value }) => (
          <div key={label} className="flex flex-nowrap gap-4">
            <span className="flex-shrink-0 w-20 font-bold"> {label}</span>
            {clickToCopy ? (
              <ClickToCopy className="flex gap-2 items-center" value={value}>
                <>{value}</>
              </ClickToCopy>
            ) : (
              <span className="line-clamp-1">{value}</span>
            )}
          </div>
        ))}
    </InfoCard>
  )
}

function ClickToCopy({
  children,
  className,
  value,
}: {
  children: React.ReactElement
  className?: string
  value: string
}) {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  return (
    <Tooltip
      className={className}
      title={copied ? 'Copied!' : 'Click to copy'}
      placement="left"
      onClose={() => setCopied(false)}
    >
      <Button
        onClick={async () => {
          await copy(value)
          setCopied(true)
        }}
        startIcon={<ContentCopyIcon />}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

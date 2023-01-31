// import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Tooltip } from "@nextui-org/react";
import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import InfoCard from './InfoCard'

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
                <span className="line-clamp-1">
                  <FontAwesomeIcon icon={faCopy} /> {value}
                </span>
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
  children: React.ReactNode
  className?: string
  value: string
}) {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  return (
    <Tooltip
      className={className}
      content={copied ? 'Copied!' : 'Click to copy'}
      onVisibleChange={visible => visible && setCopied(false)}
      placement="left"
      onClick={async () => {
        await copy(value)
        setCopied(true)
      }}
    >
      {children}
    </Tooltip>
  )
}

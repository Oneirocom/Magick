import Tooltip from '@mui/material/Tooltip'
import React, { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import InfoCard from './InfoCard'
import Button from '@mui/material/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Table, TableCell, TableContainer, TableRow } from '@mui/material'
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
      <TableContainer>
        <Table>
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
              <TableRow>
                <TableCell>{label}</TableCell>
                {clickToCopy ? (
                  <TableCell>
                    <ClickToCopy
                      className="flex gap-2 items-center"
                      value={value}
                    >
                      <>{value}</>
                    </ClickToCopy>
                  </TableCell>
                ) : (
                  <TableCell>{value}</TableCell>
                )}
              </TableRow>
            ))}
        </Table>
      </TableContainer>
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

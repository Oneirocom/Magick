// DOCUMENTED 
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import InfoCard from './InfoCard';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Table, TableCell, TableContainer, TableRow } from '@mui/material';

/**
 * MetadataCard functional component displays a table of metadata fields,
 * with optional click-to-copy functionality.
 * @param fields - An array of field objects containing label, value and clickToCopy properties.
 * @returns JSX.Element
 */
export function MetadataCard({
  fields,
}: {
  fields: Array<{
    label: string;
    value?: string | number | Date | null;
    clickToCopy?: boolean;
  }>;
}): JSX.Element {
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
  );
}

/**
 * ClickToCopy functional component wraps a child component
 * and allows a string value to be copied to the clipboard when clicked.
 * @param children - ReactElement to render.
 * @param className - Optional CSS class string.
 * @param value - String value to copy when the component is clicked.
 * @returns JSX.Element
 */
function ClickToCopy({
  children,
  className,
  value,
}: {
  children: React.ReactElement;
  className?: string;
  value: string;
}): JSX.Element {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  return (
    <Tooltip
      className={className}
      title={copied ? 'Copied!' : 'Click to copy'}
      placement="left"
      onClose={() => setCopied(false)}
    >
      <Button
        onClick={async () => {
          await copy(value);
          setCopied(true);
        }}
        startIcon={<ContentCopyIcon />}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
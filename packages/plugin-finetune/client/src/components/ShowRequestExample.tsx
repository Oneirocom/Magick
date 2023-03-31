// DOCUMENTED 
import React, {FC, useState} from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useCopyToClipboard } from 'usehooks-ts';
import ExpansionDetails from './ExpansionDetails';

/**
 * Component props
 */
interface ShowRequestExampleProps {
  reference: string;
  request: {
    url: string;
    method: string;
    headers: { [key: string]: string };
    body: { [key: string]: string | string[] | number | boolean | undefined };
  };
}

/**
 * Component that displays the JSON request example and allows the user to copy it to the clipboard
 */
const ShowRequestExample: FC<ShowRequestExampleProps> = ({reference, request}) => {
  const [, copy] = useCopyToClipboard();

  // State to show whether the code has been copied or not
  const [copied, setCopied] = useState(false);

  // JSON string of the request
  const code = JSON.stringify(request, null, 2);

  /**
   * Handles the copy to clipboard action
   */
  const handleCopy = async (): Promise<void> => {
    await copy(code);
    setCopied(true);
  }

  return (
    <ExpansionDetails title="Request JSON">
      <div className="relative prose">
        <Tooltip
          className="absolute top-0 right-0 p-2"
          title={copied ? 'Copied!' : 'Click to copy'}
          placement="left"
          onClose={() => setCopied(false)}
          onClick={handleCopy}
        >
          <></>
        </Tooltip>
        <pre>{code}</pre>
      </div>
      <p>
        <a href={reference} target="_blank" rel="noreferrer">
          OpenAI Reference
        </a>
      </p>
    </ExpansionDetails>
  )
}

export default ShowRequestExample;
// DOCUMENTED 
/**
 * A React component that displays an error message.
 * @param error - The error object or message to display.
 * @returns A JSX Element that displays the error message.
 */
import React from 'react';

interface Props {
  error: Error | string;
}

export default function ErrorMessage({ error }: Props): JSX.Element {
  return (
    <div className="relative py-3 px-4 my-4 mx-auto max-w-2xl text-red-600 bg-red-100 rounded border border-red-600">
      <strong className="font-bold">Oops!</strong>
      <span className="block sm:inline"> {String(error)}</span>
    </div>
  );
}

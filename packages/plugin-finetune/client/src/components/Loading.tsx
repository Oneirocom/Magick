// DOCUMENTED 
/**
 * A component that displays a circular progress indicator in the center of the screen to indicate that data is loading.
 * @returns JSX element
 */
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading(): JSX.Element {
  return (
    <div className="flex flex-row justify-around my-20">
      <CircularProgress size="xlarge"/>
    </div>
  );
}
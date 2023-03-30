// GENERATED 
import * as React from 'react';
import ankh from './ankh.gif';

/**
 * A loading screen component that displays a centered loading animation
 * with a "Please wait..." message.
 */
export const LoadingScreen = (): JSX.Element => (
  <div
    style={{
      height: '100%',
      width: '100%',
      backgroundColor: 'var(--dark-3)',
    }}
  >
    {/* Centered loading animation and message */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      {/* Loading animation */}
      <img
        style={{
          height: 'var(--7)',
          width: 'var(--7)',
          display: 'inline-block',
        }}
        src={ankh}
        alt="loading"
      />
      {/* "Please wait..." message */}
      <p>Please wait...</p>
    </div>
  </div>
);
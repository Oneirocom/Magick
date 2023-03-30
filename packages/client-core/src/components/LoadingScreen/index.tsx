// GENERATED 
/**
 * React component that displays a loading screen with an animated ankh gif and message.
 * @component
 */
import * as React from 'react';
import ankhGif from './ankh.gif';

/**
 * LoadingScreen component
 * @returns {JSX.Element} Loading screen component
 */
export const LoadingScreen = (): JSX.Element => (
  <div
    style={{
      height: '100%',
      width: '100%',
      backgroundColor: 'var(--dark-3)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <img
        style={{
          height: 'var(--7)',
          width: 'var(--7)',
          display: 'inline-block',
        }}
        src={ankhGif}
        alt={'loading'}
      />
      <p>Please wait...</p>
    </div>
  </div>
);
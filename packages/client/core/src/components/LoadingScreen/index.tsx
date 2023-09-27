// DOCUMENTED
import * as React from 'react'
import loader from './magick-loading.svg'

/**
 * A loading screen component that displays a centered loading animation
 * with a "Please wait..." message.
 */
export const LoadingScreen = (): JSX.Element => {
  const [loaded, setLoaded] = React.useState(false)

  const handleLoad = () => {
    setLoaded(true)
  }

  return (
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
          width: '150px',
        }}
      >
        {/* Loading animation */}
        <object
          type="image/svg+xml"
          data={loader}
          aria-label="loading..."
          style={{ visibility: loaded ? 'visible' : 'hidden' }}
          onLoad={handleLoad}
        />
        <p>Please wait...</p>
      </div>
    </div>
  )
}

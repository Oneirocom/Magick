// DOCUMENTED
// Import hooks and libraries
import { useEffect, useState } from 'react'
import InfoDialog from '../InfoDialog'

// Constants for title and body of the InfoDialog
const title = 'Set Your API Keys'
const body =
  'Please set your API keys in the editor settings to use external APIs. You will need to do this before you can use any AI features'

/**
 * SetAPIKeys component to show a warning about setting API keys.
 * @returns {JSX.Element} The SetAPIKeys component.
 */
export const SetAPIKeys = (): JSX.Element => {
  // Declare state variables
  const [showWarning, setShowWarning] = useState(false)

  // Use useEffect to check and set first-time user local storage
  useEffect(() => {
    if (!window.localStorage.getItem('first_time_user')) {
      // Set the local storage item for first-time user
      window.localStorage.setItem(
        'first_time_user',
        JSON.stringify({ has_seen_api_key_warning: true })
      )
      // Show the warning for API keys
      setShowWarning(true)
    }
  }, [])

  // Render the component
  return (
    <>
      {showWarning && (
        <InfoDialog
          title={title}
          body={body}
          style={{
            width: '100%',
            height: '1px',
            marginLeft: '89%',
            marginTop: '-20%',
          }}
        />
      )}
    </>
  )
}

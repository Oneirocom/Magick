import { useEffect, useState } from 'react'
import InfoDialog from '../InfoDialog'

const title = 'Set Your API Keys'
const body =
  'Please set your API keys in the editor settings to use external APIs. You will need to do this before you can use any AI features'

export const SetAPIKeys = () => {
  const [showWarning, setShowWarning] = useState(false)
  useEffect(() => {
    if (!window.localStorage.getItem('first_time_user')) {
      window.localStorage.setItem(
        'first_time_user',
        JSON.stringify({ has_seen_api_key_warning: true })
      )
      setShowWarning(true)
    }
  }, [])
  return (
    <>
    showWarning && (
      <InfoDialog
        title={title}
        body={body}
        style={{
          width: '100%',
          height: '1px',
          marginLeft: '89%',
          marginTop: '-40%',
        }}
      />
    )
    </>
  )
}

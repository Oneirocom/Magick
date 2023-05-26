// DOCUMENTED
import { Tooltip } from '@magickml/client-core'
import { pluginManager } from '@magickml/core'
import { Clear } from '@mui/icons-material/'
import { IconButton, Input } from '@mui/material'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import styles from './styles.module.scss'

/**
 * This function component renders an input form for entering an API key and buttons to copy and clear the key.
 *
 * @param {Object} props - The properties of this component.
 * @param {string} props.displayName - The display name for the service key.
 * @param {string} props.keyName - The key name of the service key.
 * @param {string} props.getUrl - The URL where the user can find the API key.
 * @param {(key: string, value: string) => void} props.setKey - Function to set service key in local storage.
 * @param {(key: string) => string} props.getKey - Function to get service key from local storage.
 * @return {JSX.Element} The rendered component.
 */
const SettingsWindowChild = ({
  displayName,
  keyName,
  getUrl,
  setKey,
  getKey,
}) => {
  // State for copy and clear button labels
  // const [copy, setCopy] = useState('Copy')
  const [clear, setClear] = useState('Clear')
  // Snackbar for showing notifications
  const { enqueueSnackbar } = useSnackbar()

  return (
    <div className={styles['child']}>
      <p className={styles['title']}>{displayName}</p>

      <Input
        className={styles['input']}
        type="password"
        placeholder="Paste Your API Key"
        id={keyName}
        name={keyName}
        value={getKey(keyName) || ''}
        onChange={e => {
          setKey(keyName, e.target.value)
          // Show success message
          enqueueSnackbar(`${displayName.toLowerCase()} set successfully`, {
            variant: 'success',
          })
        }}
      />
      {getKey(keyName) && getKey(keyName) !== '' && (
        <>
          {/* CANNOT COPY SECRET KEYS  */}
          {/* <Tooltip title={copy}>
            <IconButton
              className={styles['icon']}
              onClick={() => {
                navigator.clipboard.writeText(getKey(keyName))
                setCopy('Copied')
                setTimeout(() => {
                  setCopy('Copy')
                }, 1000)
              }}
            >
              <FileCopy />
            </IconButton>
          </Tooltip> */}
          <Tooltip title={clear}>
            <IconButton
              className={styles['icon']}
              onClick={() => {
                setKey(keyName, '')
                setClear('Cleared')
                setTimeout(() => {
                  setClear('Clear')
                }, 1000)
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </>
      )}

      <div className={styles['info']}>
        Your API key is{' '}
        <a href={getUrl} target="_blank" rel="noreferrer" tabIndex={-1}>
          available here.
        </a>
      </div>
    </div>
  )
}

/**
 * This function component renders the settings window.
 *
 * @return {JSX.Element} The rendered component.
 */
const SettingsWindow = () => {
  // State for nonce
  const [nonce, setNonce] = useState(0)

  // Function to get service key from local storage
  const getKey = key => {
    if (!window.localStorage.getItem('secrets')) {
      window.localStorage.setItem('secrets', JSON.stringify({}))
    }

    const secrets = window.localStorage.getItem('secrets')

    return JSON.parse(secrets)[key]
  }

  // Function to set service key in local storage
  const setKey = (newKey, newValue) => {
    const secrets = window.localStorage.getItem('secrets')
    const json = secrets ? JSON.parse(secrets) : {}
    const newJsonString = JSON.stringify({ ...json, [newKey]: newValue })
    window.localStorage.setItem('secrets', newJsonString)
    setNonce(nonce + 1)
  }

  const globalSecrets = pluginManager.getSecrets(true)

  return (
    nonce !== null && (
      <div className={styles['settings-editor']}>
        {globalSecrets.map((value, index) => {
          return (
            <SettingsWindowChild
              key={value.key}
              displayName={value.name}
              keyName={value.key}
              getUrl={value.getUrl}
              setKey={setKey}
              getKey={getKey}
            />
          )
        })}
        <div className={styles['child']}>
          <p>
            We do not keep your API keys. They are stored in your browser's
            local storage.
          </p>
        </div>
      </div>
    )
  )
}

export default SettingsWindow

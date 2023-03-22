import { Tooltip } from '@magickml/client-core'
import { pluginManager } from '@magickml/engine'
import { Clear, FileCopy } from '@mui/icons-material/'
import { IconButton, Input } from '@mui/material'
import { useState } from 'react'
import styles from './styles.module.scss'

const SettingsWindowChild = ({
  displayName,
  keyName,
  getUrl,
  setKey,
  getKey,
}) => {
  const [copy, setCopy] = useState('Copy')
  const [clear, setClear] = useState('Clear')

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
        }}
      />
      {getKey(keyName) && getKey(keyName) !== '' && (
        <>
          <Tooltip title={copy}>
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
          </Tooltip>
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

const SettingsWindow = () => {
  const [nonce, setNonce] = useState(0)
  const getKey = key => {
    if (!window.localStorage.getItem('secrets')) {
      window.localStorage.setItem('secrets', JSON.stringify({}))
    }

    const secrets = window.localStorage.getItem('secrets')

    return JSON.parse(secrets)[key]
  }

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

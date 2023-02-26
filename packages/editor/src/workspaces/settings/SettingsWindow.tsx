import React, { useEffect, useState } from 'react'
import { useConfig } from '../../contexts/ConfigProvider'
import { KeyboardArrowDown, FileCopy, Clear } from '@mui/icons-material/'
import styles from './styles.module.scss'
import { IconButton } from '@mui/material'
import { Tooltip } from '@magickml/client-core'
import useAuthentication from '../../screens/FineTuneManager/account/useAuthentication'

const SettingsWindow = () => {
  const config = useConfig()
  const [apiKey, setApiKey] = useState<any>('')
  const [copy, setCopy] = useState<string>('copy')
  const [clear, setClear] = useState<string>('clear')
  const { signOut } = useAuthentication()

  useEffect(() => {
    const openai = window.localStorage.getItem('openai-api-key')
    setApiKey(openai ? JSON.parse(openai).apiKey : '')
  }, [])

  return (
    <div className={styles['settings-editor']}>
      <div className={styles['child']}>
        <div className={styles['innerChild']}>
          <p className={styles['title']}>
            Your OpenAI Key
            <span className={`${styles['md-margin']} ${styles['flexCenter']}`}>
              <KeyboardArrowDown className={styles['icon']} />
            </span>{' '}
          </p>
          <div className={styles['padHorizontal']}>
            <div>
              <p>
                Your API key is{' '}
                <a
                  href="https://beta.openai.com/account/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={-1}
                >
                  available here.
                </a>
              </p>
            </div>

            <form>
              <input
                className={styles['input']}
                type="password"
                placeholder="Paste Your OpenAI API Key"
                id="openai-api-key"
                name="api-key"
                value={apiKey}
                onChange={e => {
                  setApiKey(e.target.value)
                  localStorage.setItem(
                    'openai-api-key',
                    JSON.stringify({ apiKey: e.target.value })
                  )
                }}
              />
              {apiKey && (
                <>
                  <Tooltip title={copy}>
                    <IconButton
                      className={styles['icon']}
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey)
                        setCopy('copied!')
                        setTimeout(() => {
                          setCopy('copy')
                        }, 2000)
                      }}
                    >
                      <FileCopy />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={clear}>
                    <IconButton
                      className={styles['icon']}
                      onClick={() => {
                        localStorage.removeItem('openai-api-key')
                        signOut()
                        setApiKey('')
                        setClear('Cleared!')
                        setTimeout(() => {
                          setClear('clear')
                        }, 2000)
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsWindow

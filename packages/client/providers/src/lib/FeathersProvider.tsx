// DOCUMENTED
import { getLogger } from 'shared/core'
import { createContext, useContext, useEffect, useState } from 'react'
import { useConfig } from './ConfigProvider'
import FeathersClient from './FeathersClient'

interface FeathersContext {
  client: any | null
}

/**
 * Feathers Context definition
 */
const Context = createContext<FeathersContext>(undefined!)

/**
 * Custom hook for Feathers Context
 */
export const useFeathers = (): FeathersContext => useContext(Context)

/**
 * FeathersProvider component
 * @props children, token
 */
export const FeathersProvider = ({ children, token }): JSX.Element | null => {
  const config = useConfig()
  const [client, setClient] = useState<FeathersContext['client']>(null)
  const logger = getLogger()

  useEffect(() => {
    ; (async (): Promise<void> => {
      const client = await FeathersClient.initialize(token, config)

      client.io.on('connect', async (): Promise<void> => {
        setClient(client)
      })

      client.io.on('reconnect', (): void => {
        logger.info('Reconnected to the server')
        setClient(client)
      })

      client.io.on('disconnect', (): void => {
        logger.info("We've been disconnected from the server")
        setTimeout((): void => {
          logger.info('Reconnecting...')
          client.io.connect()
        }, 1000)
      })

      client.io.on('error', (error): void => {
        logger.info(`Connection error: ${error} \n trying to reconnect...`)
        setTimeout((): void => {
          logger.info('Reconnecting...')
          client.io.connect()
        }, 1000)
      })

      client.service('agents').on('log', (data): void => {
        logger.info('agents log', data)
      })
    })()
  }, [])

  const publicInterface: FeathersContext = {
    client,
  }

  if (!client) return null

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

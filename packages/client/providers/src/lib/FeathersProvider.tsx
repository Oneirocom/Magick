// DOCUMENTED
import { getLogger } from 'shared/core'
import { createContext, useContext, useEffect, useState } from 'react'
import { useConfig } from './ConfigProvider'
import { feathersClient } from 'client/feathers-client'
import { useDispatch } from 'react-redux'
import { setConnected } from 'client/state'

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
  const dispatch = useDispatch()
  const config = useConfig()
  const [client, setClient] = useState<FeathersContext['client']>(null)
  const logger = getLogger()

  useEffect(() => {
    ; (async (): Promise<void> => {
      const client = await feathersClient.initialize(token, config)
      dispatch(setConnected(false))

      client.io.on('connect', async (): Promise<void> => {
        dispatch(setConnected(true))
        setClient(client)
      })

      client.io.on('reconnect', (): void => {
        logger.info('Reconnected to the server')
        dispatch(setConnected(true))
        setClient(client)
      })

      client.io.on('disconnect', (): void => {
        logger.info("We've been disconnected from the server")
        dispatch(setConnected(false))
        setTimeout((): void => {
          logger.info('Reconnecting...')
          client.io.connect()
        }, 1000)
      })

      client.io.on('error', (error): void => {
        dispatch(setConnected(false))
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

    // check just to be sure we are reporting properly
    const intervalId = setInterval((): void => {
      if (!client) return
      if (client.io.connected) {
        dispatch(setConnected(true))
      } else {
        dispatch(setConnected(false))
      }
    }, 1000)

    return (): void => {
      clearInterval(intervalId)
    }
  }, [])

  const publicInterface: FeathersContext = {
    client,
  }

  if (!client) return null

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

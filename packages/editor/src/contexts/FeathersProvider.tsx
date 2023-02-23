import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

import LoadingScreen from '../components/LoadingScreen/LoadingScreen'
import { useConfig } from './ConfigProvider'

const buildFeathersClient = async config => {
  const socket = io(config.apiUrl)
  const feathersClient = feathers()
  feathersClient.configure(socketio(socket, { timeout: 10000 }))

  // No idea how to type feathers to add io properties to root client.
  return feathersClient as any
}

interface FeathersContext {
  client: any | null
}

const Context = createContext<FeathersContext>(undefined!)

export const useFeathers = () => useContext(Context)

// Might want to namespace these
const FeathersProvider = ({ children }) => {
  const config = useConfig()
  const [client, setClient] = useState<FeathersContext['client']>(null)

  useEffect(() => {
    console.log('attempted to connect')
    // We only want to create the feathers connection once we have a user to handle
    ;(async () => {
      const client = await buildFeathersClient(config)

      client.io.on('connect', () => {
        setClient(client)
      })

      client.io.on('reconnect', () => {
        console.log('Reconnected to the server')
        setClient(client)
      })

      client.io.on('disconnect', () => {
        console.log("We've been disconnected from the server")
        setTimeout(() => {
          console.log('Reconnecting...')
          client.io.connect()
        }, 1000)
      })

      client.io.on('error', error => {
        console.log('Connection error: ' + error + '\n trying to reconnect...')
        setTimeout(() => {
          console.log('Reconnecting...')
          client.io.connect()
        }, 1000)
      })
    })()
  }, [])

  const publicInterface: FeathersContext = {
    client,
  }

  if (!client) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  return <FeathersProvider {...props} />
}

export default ConditionalProvider

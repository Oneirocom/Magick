import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import { useContext, createContext, useEffect, useState } from 'react'

import { feathers as feathersFlag, feathersUrl } from '../utils/config'

const buildFeathersClient = async () => {
  const feathersClient = feathers()
  const socket = io(feathersUrl)
  feathersClient.configure(feathers.socketio(socket, { timeout: 10000 }))

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
  const [client, setClient] = useState<FeathersContext['client']>(null)

  useEffect(() => {
    // We only want to create the feathers connection once we have a user to handle
    ;(async () => {
      const client = await buildFeathersClient()
      client.io.on('connected', () => {
        setClient(client)
      })
    })()
  }, [])

  const publicInterface: FeathersContext = {
    client,
  }

  // if (!client) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  if (!feathersFlag) return props.children

  return <FeathersProvider {...props} />
}

export default ConditionalProvider

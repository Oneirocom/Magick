import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import { useContext, createContext, useEffect, useState } from 'react'

import { feathers as feathersFlag, feathersUrl } from '@/config'
// import { Application } from '@feathersjs/feathers'

import { getAuthHeader, useAuth } from './AuthProvider'

const buildFeathersClient = async () => {
  const feathersClient = feathers()
  const authHeaders = await getAuthHeader()
  const socket = io(feathersUrl, {
    // Send the authorization header in the initial connection request
    transportOptions: {
      polling: {
        withCredentials: true,
        extraHeaders: authHeaders,
      },
    },
  })
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

  const { done } = useAuth()

  useEffect(() => {
    // We only want to create the feathers connection once we have a user to handle
    if (!done) return
    ;(async () => {
      const client = await buildFeathersClient()
      client.io.on('connected', () => {
        setClient(client)
      })
    })()
  }, [done])

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

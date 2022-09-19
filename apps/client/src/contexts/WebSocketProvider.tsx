import { websockets, websocketUrl } from '@/config'
import { useContext, createContext, useEffect, useState } from 'react'

import ReconnectingWebSocket from 'reconnecting-websocket'
import { Socket } from 'sharedb/lib/sharedb'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'

interface SharedbContext {
  socket: Socket | null
}

const Context = createContext<SharedbContext>({
  socket: null,
})

export const useWebSocket = () => useContext(Context)

export const docMap = new Map()

// Might want to namespace these
const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const _socket = new ReconnectingWebSocket(websocketUrl)
    setSocket(_socket as Socket)

    _socket.send('testing')
  }, [])

  const publicInterface: SharedbContext = {
    socket,
  }

  if (!socket) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  if (!websockets) return props.children

  return <WebSocketProvider {...props} />
}

export default ConditionalProvider

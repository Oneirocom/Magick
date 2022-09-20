import { createContext, useContext, useEffect, useState } from 'react';
import { Doc } from 'sharedb';
import client from 'sharedb/lib/client';
import { Socket } from 'sharedb/lib/sharedb';

import { Spell } from '@thothai/core';

import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { sharedb } from '../config';
import { useWebSocket } from './WebSocketProvider';

const Connection = client.Connection

interface SharedbContext {
  connection: client.Connection | null
  getSpellDoc: (spell: Spell) => Doc | null
}

const Context = createContext<SharedbContext>({
  connection: null,
  getSpellDoc: () => null,
})

export const useSharedb = () => useContext(Context)

export const docMap = new Map()

// Might want to namespace these
const SharedbProvider = ({ children }) => {
  const { socket } = useWebSocket()
  const [connection, setConnection] = useState<client.Connection | null>(null)

  useEffect(() => {
    const _connection = new Connection(socket as Socket)
    setConnection(_connection)
  }, [])

  const getSpellDoc = (spell: Spell) => {
    if (!connection) return
    const key = spell.name
    if (docMap.has(key)) return docMap.get(key)

    const doc = connection.get('spell', key)
    docMap.set(key, doc)

    doc.subscribe(error => {
      if (error) return console.error(error)

      // If doc.type is undefined, the document has not been created, so let's create it
      if (!doc.type) {
        doc.create(spell, error => {
          if (error) console.error(error)
        })
      }
    })

    return doc
  }

  const publicInterface: SharedbContext = {
    connection,
    getSpellDoc,
  }

  if (!connection) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  if (!sharedb) return props.children

  return <SharedbProvider {...props} />
}

export default ConditionalProvider

'use client'
import { GraphJSON, GraphSocketJSON } from '@magickml/behave-graph'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useState } from 'react'
import SingleElement from './SingleElement'
import { AddNewSocket, AddedSocket } from './SocketConfig'
import { Tab, usePubSub } from '@magickml/providers'
import { Button } from '@magickml/client-ui'

const defaultSocketValues = [
  'string',
  'float',
  'integer',
  'boolean',
  'array',
  'object',
]

export const SubspellSocketConfig = ({
  type,
  socketValues = defaultSocketValues,
  tab,
  graph,
  sockets,
  setSockets,
  title,
  getSockets,
}: {
  type: 'input' | 'output'
  socketValues?: string[]
  tab: Tab
  graph: GraphJSON
  sockets: GraphSocketJSON[]
  setSockets: (sockets: GraphSocketJSON[]) => void
  title: string
  getSockets: (sockets: GraphSocketJSON[]) => GraphSocketJSON[]
}) => {
  const { publish, events } = usePubSub()
  const [initialSockets] = useState<GraphSocketJSON[]>([])
  const [showForm, setShowForm] = useState(false)
  const socketKey = type === 'input' ? 'graphInputs' : 'graphOutputs'

  const addSocket = useCallback(
    (socket: AddedSocket) => {
      const newSocket: GraphSocketJSON = {
        key: socket.name,
        valueType: socket.valueType,
        description: socket.description,
      }

      const newSockets = [...sockets, newSocket]

      setSockets(newSockets)

      const newGraph = { ...graph, [socketKey]: newSockets }

      publish(events.$SAVE_SPELL(tab.id), { graph: newGraph })
      setShowForm(false)
    },
    [graph, type, tab, publish, events, getSockets]
  )

  const deleteSocket = (name: string) => {
    const sockets = graph[socketKey] || []
    const newSockets = sockets.filter(
      (socket: GraphSocketJSON) => socket.key !== name
    )

    const newGraph = { ...graph, [socketKey]: newSockets }

    setSockets(newSockets)

    publish(events.$SAVE_SPELL(tab.id), { graph: newGraph })
  }

  return (
    <div className="pb-2">
      <div className="w-full p-1 bg-[var(--background-color-light)] flex justify-between items-center">
        <h3>{title}</h3>
        <Button
          className="float-right"
          variant="outline"
          size="sm"
          onClick={() => {
            setShowForm(prev => !prev)
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
      {showForm && (
        <div className="pr-1 pl-1">
          <AddNewSocket
            sockets={sockets}
            addSocket={addSocket}
            valueTypes={socketValues}
            definedValueType={null}
            includeDescription={true}
          />
        </div>
      )}
      {getSockets(sockets).map((socket: GraphSocketJSON, i: number) => (
        <div className="pr-1 pl-1">
          <SingleElement
            name={socket.key}
            key={socket.key + i}
            delete={deleteSocket}
            type={socket.valueType}
          />
        </div>
      ))}
    </div>
  )
}

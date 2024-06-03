import { GraphJSON, GraphSocketJSON } from '@magickml/behave-graph'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from 'react'
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
  sockets,
  type,
  socketValues = defaultSocketValues,
  tab,
  graph,
  title,
}: {
  sockets: GraphSocketJSON[]
  type: 'input' | 'output'
  socketValues?: string[]
  tab: Tab
  graph: GraphJSON
  title: string
}) => {
  const { publish, events } = usePubSub()
  const [initialSockets, setInitialSockets] = useState<GraphSocketJSON[]>(
    sockets || []
  )
  const [showForm, setShowForm] = useState(false)
  const toggleForm = () => {
    setShowForm(!showForm)
  }

  useEffect(() => {
    if (!sockets) return
    setInitialSockets(sockets)
  }, [sockets])

  const addSocket = useCallback(
    (socket: AddedSocket) => {
      const newSocket: GraphSocketJSON = {
        key: socket.name,
        valueType: socket.valueType,
        description: socket.description,
      }

      const socketType = type === 'input' ? 'graphInputs' : 'graphOutputs'

      const sockets = graph[socketType] || []
      const newSockets = [...sockets, newSocket]

      setInitialSockets(newSockets)

      const newGraph = { ...graph, [socketType]: newSockets }

      publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: newGraph })
      setShowForm(false)
    },
    [sockets]
  )

  const deleteSocket = (name: string) => {
    const socketType = type === 'input' ? 'graphInputs' : 'graphOutputs'

    const sockets = graph[socketType] || []
    const newSockets = sockets.filter(
      (socket: GraphSocketJSON) => socket.key !== name
    )

    const newGraph = { ...graph, [socketType]: newSockets }

    setInitialSockets(newSockets)

    publish(events.$SAVE_SPELL_DIFF(tab.id), { graph: newGraph })
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
            sockets={initialSockets}
            addSocket={addSocket}
            valueTypes={socketValues}
            definedValueType={null}
            includeDescription={true}
          />
        </div>
      )}
      {initialSockets.map((socket: GraphSocketJSON, i: number) => (
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

// DOCUMENTED
import { useState, useEffect } from 'react'
import Form from './Form'
import SingleElement from './SingleElement'

/**
 * Renders a single socket component.
 * @param {object} props - Component properties.
 * @returns {JSX.Element} - Single socket JSX element.
 */
const SingleSocket = (props: {
  name: string
  delete: (name: string) => void
  type: string
  last: boolean
}) => {
  return props.delete ? (
    <SingleElement name={props.name} delete={props.delete} />
  ) : (
    <div style={{ marginTop: '10px', flex: 1, width: '100%' }}>
      <p style={{ display: 'inline' }}>{props.name}</p>
    </div>
  )
}

/**
 * Renders an AddNewSocket component.
 * @param {object} props - Component properties.
 * @returns {JSX.Element} - Add new socket JSX element.
 */
const AddNewSocket = (props: { addSocket: Function }) => {
  const [value, setValue] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const onAdd = () => {
    props.addSocket(value)
    setValue('')
  }

  return (
    <Form
      value={value}
      placeHolder="Name your socket..."
      onChange={onChange}
      onAdd={onAdd}
    />
  )
}

/**
 * MultiSocketGenerator component that generates sockets.
 * @param {object} props - Component properties.
 * @returns {JSX.Element} - Socket generator JSX element.
 */
const MultiSocketGenerator = ({
  updateData,
  control,
  initialValue,
}: {
  updateData: Function
  control: any
  initialValue: any[]
}) => {
  const [sockets, setSockets] = useState([...initialValue])
  const { data, dataKey } = control

  useEffect(() => {
    if (!initialValue) return
    const newSockets = initialValue.filter(
      socket => !data.ignored.some(ignored => ignored.name === socket.name)
    )
    setSockets(newSockets)
  }, [initialValue, data.ignored])

  const onDelete = (name: string) => {
    const shortName = name.split(' ')[0]

    const newSockets = sockets.filter(
      socket => !socket.name.includes(shortName)
    )
    setSockets(newSockets)
    update(newSockets)
  }

  const update = (update: any) => {
    updateData({ [dataKey]: update })
  }

  const addSocket = (socket: string) => {
    const socketTypes = data.socketTypes
    const newSockets = [...sockets]

    const socketTypesMap: { [key: string]: number } = {}

    // for each socketType, create a newSocket and add it to the sockets array
    socketTypes.forEach((socketType: string, i: number) => {
      // check if the socketType already exists in the sockets array
      // if it doesn't, add the key and set the value to 0
      // if it does, increment the value
      if (!socketTypesMap[socketType]) {
        socketTypesMap[socketType] = 0
      } else {
        socketTypesMap[socketType]++
      }

      const index = socketTypesMap[socketType]

      const newSocket = {
        name:
          socket +
          ' ' +
          (socketType === 'anySocket'
            ? 'data'
            : socketType.replace('Socket', '')) +
          (index > 0 ? ' ' + index : ''),
        taskType: data.taskTypes[i],
        socketKey:
          socket +
          ' ' +
          (socketType === 'anySocket'
            ? 'data'
            : socketType.replace('Socket', '')) +
          (index > 0 ? ' ' + index : ''),
        connectionType: data.connectionType,
        socketType: socketType,
      }

      newSockets.push(newSocket)
    })

    setSockets(newSockets)
    update(newSockets)
  }

  const socketNames: string[] = []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <AddNewSocket addSocket={addSocket} />
      {sockets.map((socket, i) => {
        const shortName = socket.name.split(' ')[0]
        const hasSocket = socketNames.includes(shortName)
        if (!socketNames.includes(shortName)) socketNames.push(shortName)
        const nextShortName = sockets[i + 1]
          ? sockets[i + 1].name.split(' ')[0]
          : ''
        const isLast = i === sockets.length - 1 || nextShortName !== shortName
        return (
          <SingleSocket
            name={socket.name}
            key={i}
            last={isLast}
            delete={!hasSocket ? onDelete : null}
            type={socket.socketType}
          />
        )
      })}
    </div>
  )
}

export default MultiSocketGenerator

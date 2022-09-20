import { useState, useEffect } from 'react'

const SingleSocket = props => {
  return (
    <div style={{ marginBottom: 10, flex: 1, width: '100%' }}>
      <p style={{ display: 'inline' }}>{props.name}</p>
      <span style={{ float: 'right' }}>
        <button className="list" onClick={() => props.delete(props.name)}>
          Delete
        </button>
      </span>
    </div>
  )
}

const AddNewSocket = props => {
  const [value, setValue] = useState('')

  const onChange = e => {
    setValue(e.target.value)
  }

  const onAdd = () => {
    props.addSocket(value)
    setValue('')
  }

  return (
    <div style={{ display: 'flex', gap: 'var(--extraSmall)' }}>
      <input
        style={{ flex: 6 }}
        value={value}
        type="text"
        onChange={onChange}
        placeholder={'Name your socket...'}
      />
      <button style={{ flex: 1 }} onClick={onAdd}>
        + Add
      </button>
    </div>
  )
}

const SocketGenerator = ({ updateData, control, initialValue }) => {
  const [sockets, setSockets] = useState([...initialValue])
  const { data, dataKey } = control

  useEffect(() => {
    if (!initialValue) return
    const newSockets = initialValue.filter(
      socket => !data.ignored.some(ignored => ignored.name === socket.name)
    )
    console.log('SOCKETS', newSockets)
    setSockets(newSockets)
  }, [initialValue])

  const onDelete = name => {
    const newSockets = sockets.filter(socket => socket.name !== name)
    setSockets(newSockets)
    update(newSockets)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const addSocket = socket => {
    const newSocket = {
      name: socket,
      taskType: data.taskType,
      // might also want to camel case any spacing here too
      socketKey: socket,
      connectionType: data.connectionType,
      socketType: data.socketType,
    }

    console.log('Adding socket', newSocket)

    const newSockets = [...sockets, newSocket]

    setSockets(newSockets)
    update(newSockets)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {sockets.map((socket, i) => (
        <SingleSocket name={socket.name} key={i} delete={onDelete} />
      ))}
      <AddNewSocket addSocket={addSocket} />
    </div>
  )
}

export default SocketGenerator

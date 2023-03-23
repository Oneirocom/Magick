import { useState, useEffect } from 'react'
import Form from './Form'
import SingleElement from './SingleElement'

const AddNewSocket = props => {
  const [value, setValue] = useState('')

  const onChange = e => {
    setValue(e.target.value)
  }

  const onAdd = e => {
    if (!value) return
    e.preventDefault()
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

const SocketGenerator = ({ updateData, control, initialValue }) => {
  const [sockets, setSockets] = useState([...initialValue])
  const { data, dataKey } = control

  useEffect(() => {
    if (!initialValue) return
    const newSockets = initialValue.filter(
      socket => !data.ignored.some(ignored => ignored.name === socket.name)
    )
    
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

    const newSockets = [newSocket, ...sockets]

    setSockets(newSockets)
    update(newSockets)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <AddNewSocket addSocket={addSocket} />
      {sockets.map((socket, i) => (
        <SingleElement
          name={socket.name}
          key={i}
          delete={onDelete}
          type={socket.socketType}
        />
      ))}
    </div>
  )
}

export default SocketGenerator

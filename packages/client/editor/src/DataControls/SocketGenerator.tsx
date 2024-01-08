// DOCUMENTED
import { useState, useEffect } from 'react'
import Form from './Form'
import SingleElement from './SingleElement'

/**
 * AddNewSocket component provides a form input to add a new socket.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.addSocket - Function to add a new socket.
 * @returns {React.JSX.Element} Form input to add a new socket.
 */
const AddNewSocket = ({ addSocket }) => {
  const [value, setValue] = useState('')

  /**
   * Update the input value when changed.
   *
   * @param {Event} e - The change event.
   */
  const onChange = e => {
    setValue(e.target.value)
  }

  /**
   * Add a new socket on form submission.
   *
   * @param {Event} e - The submit event.
   */
  const onAdd = e => {
    if (!value) return
    e.preventDefault()
    addSocket(value)
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
 * SocketGenerator component generates a list of sockets.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.updateData - Function to update data outside the component.
 * @param {Object} props.control - Control object containing data and dataKey.
 * @param {Array} props.initialValue - Initial value of the sockets.
 * @returns {React.JSX.Element} List of sockets with input to add new sockets.
 */
const SocketGenerator = ({ updateData, control, initialValue }) => {
  const [sockets, setSockets] = useState([...initialValue])
  const { data, dataKey } = control

  // Update sockets when initialValue changes.
  useEffect(() => {
    if (!initialValue) return
    const newSockets = initialValue.filter(
      socket => !data.ignored.some(ignored => ignored.name === socket.name)
    )

    setSockets(newSockets)
  }, [initialValue, data.ignored])

  /**
   * Remove a socket with the given name.
   *
   * @param {string} name - Name of the socket to remove.
   */
  const onDelete = name => {
    const newSockets = sockets.filter(socket => socket.name !== name)
    setSockets(newSockets)
    update(newSockets)
  }

  /**
   * Update the socket list.
   *
   * @param {Array} updatedSockets - The updated socket list.
   */
  const update = updatedSockets => {
    updateData({ [dataKey]: updatedSockets })
  }

  /**
   * Add a new socket with the given name.
   *
   * @param {string} socket - The name of the new socket.
   */
  const addSocket = socket => {
    const newSocket = {
      name: socket,
      taskType: data.taskType,
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

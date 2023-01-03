import { useState, useEffect } from 'react'

const SingleSocket = props => {
  return (
    <div style={{ marginBottom: props.last ? '30px' : 0, flex: 1, width: '100%' }}>
      <p style={{ display: 'inline' }}>{props.name}</p>
      {props.delete &&
      <span style={{ float: 'right' }}>
        <button className="list" onClick={() => props.delete(props.name)}>
          Delete
        </button>
      </span>
}
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
    const shortName = name.split(' ')[0]

    const newSockets = sockets.filter(socket => !socket.name.includes(shortName))
    setSockets(newSockets)
    update(newSockets)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const addSocket = socket => {
    const socketTypes = data.socketTypes
    const newSockets = [...sockets]

    const socketTypesMap = {};

    // for each socketType, create a newSocket and add it to the sockets array
    socketTypes.forEach((socketType, i) => {
      
      // check if the socketType already exists in the sockets array
      // if it doesnt, add the key and set the value to 0
      // if it does, increment the value
      if (!socketTypesMap[socketType]) {
        socketTypesMap[socketType] = 0
      } else {
        socketTypesMap[socketType]++
      }

      const index = socketTypesMap[socketType];

    const newSocket = {
      name: socket + ' ' + (socketType === 'anySocket' ? 'data' : socketType.replace('Socket', '')) + (index > 0 ? ' ' + index : ''),
      taskType: data.taskTypes[i],
      socketKey: socket + ' ' + (socketType === 'anySocket' ? 'data' : socketType.replace('Socket', '')) + (index > 0 ? ' ' + index : ''),
      connectionType: data.connectionType,
      socketType: socketType,
    }

    newSockets.push(newSocket)

    console.log('Adding socket', newSocket)
  });


    setSockets(newSockets)
    update(newSockets)
  }

  let socketNames: string[] = []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {sockets.map((socket, i) => {
        const shortName = socket.name.split(' ')[0]
        const hasSocket = socketNames.includes(shortName)
        if(!socketNames.includes(shortName)) socketNames.push(shortName);
        const nextShortName = sockets[i + 1] ? sockets[i + 1].name.split(' ')[0] : '';
        let isLast = i === sockets.length - 1 || nextShortName !== shortName;
        return <SingleSocket name={socket.name} key={i} last={isLast} delete={!hasSocket ? onDelete : null} />
      })}
      <AddNewSocket addSocket={addSocket} />
    </div>
  )
}

export default SocketGenerator

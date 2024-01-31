import { useCallback, useState } from "react"
import { ConfigurationComponentProps } from "./PropertiesWindow"
import SingleElement from "./SingleElement"

/**
 * AddNewSocket component provides a form input to add a new socket.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.addSocket - Function to add a new socket.
 * @returns {React.JSX.Element} Form input to add a new socket.
 */
const AddNewSocket = ({ addSocket, valueTypes, definedValueType }) => {
  const [value, setValue] = useState('')
  const [selectedValueType, setSelectedValueType] = useState('string')

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
    addSocket({ name: value, valueType: definedValueType || selectedValueType })
    setValue('')
    setSelectedValueType('string')
  }

  return (
    <form className="w-full mt-1">
      {/* Flexbox container for input field and add button */}
      <div className="flex gap-1">
        {/* Input field */}
        <input
          className="flex-grow"
          value={value}
          type="text"
          onChange={onChange}
          required
          placeholder="Add new socket"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onAdd(e)
            }
          }}
        />
        {!definedValueType &&
          <select
            value={selectedValueType}
            onChange={e => setSelectedValueType(e.target.value)}
            className="flex flex-1 px-3 bg-[var(--background-color)] rounded-sm">
            {
              valueTypes.map(type => (
                <option value={type}>{type}</option>
              ))
            }
          </select>

        }
        {/* Add button */}
        <button style={{ margin: 0 }} onClick={onAdd} type="submit">
          Add
        </button>
      </div>
    </form>
  )
}


export const SocketConfig = ({ config, updateConfigKey, fullConfig }: ConfigurationComponentProps) => {
  const defaultValues = [
    'string',
    'integer',
    'boolean'
  ]
  const [configKey, sockets = []] = config
  const { socketValues = defaultValues, valueType = null } = fullConfig

  const addSocket = useCallback((socket) => {
    const newValue = [
      ...sockets,
      {
        name: socket.name,
        valueType: socket.valueType
      }
    ]

    updateConfigKey(configKey, newValue)
  }, [sockets, configKey, updateConfigKey])

  const deleteSocket = (name: string) => {
    const newValue = sockets.filter((socket: any) => socket.name !== name)
    updateConfigKey(configKey, newValue)
  }

  return (
    <div>
      <h4>Input Sockets</h4>
      {sockets.map((socket: any) => (
        <SingleElement
          name={socket.name}
          key={socket.name}
          delete={deleteSocket}
          type={socket.valueType}
        />
      ))}
      <div>
        <AddNewSocket addSocket={addSocket} valueTypes={socketValues} definedValueType={valueType} />
        {/* <Input value={key} onChange={e => setKey(e.target.value)} />
        <select value={valueType} onChange={e => setValueType(e.target.value)}>
          <option value="string">string</option>
          <option value="integer">integer</option>
          <option value="boolean">boolean</option>
        </select>
        <button onClick={addSocket}>Add</button> */}
      </div>
    </div>
  )
}

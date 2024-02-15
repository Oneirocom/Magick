import { useCallback, useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import SingleElement from './SingleElement'
// import InputSocket from '../react-flow/InputSocket'

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'
import { TextInputField } from '../react-flow/TextInputField'

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
      <div className="flex h-20 mr-2">
        <div className="flex gap-2 items-center h-10 ">
          {/* Input field */}
          <TextInputField
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
            className="w-28 h-8 pl-2 input-placeholder bg-[var(--dark-3)] border-[var(--dark-3)]"
          />
          {!definedValueType && (
            <Select
              value={selectedValueType}
              onValueChange={e => setSelectedValueType(e)}
            >
              <SelectTrigger className="h-8 pl-2 text-xs pr-1 font-medium border-0 bg-[var(--dark-1)]">
                <SelectValue placeholder={'Select a type'}>
                  {selectedValueType.charAt(0).toUpperCase() +
                    selectedValueType.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-auto min-w-full">
                {valueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    <div>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {/* Add button */}
          <Button
            onClick={onAdd}
            // type="submit"
            className="h-8 w-8 border border-[var(--dark-3)] bg-ds-neutral rounded-sm"
          >
            +
          </Button>
        </div>
      </div>
    </form>
  )
}

export const SocketConfig = ({
  config,
  updateConfigKey,
  fullConfig,
}: ConfigurationComponentProps) => {
  const defaultValues = ['string', 'integer', 'boolean']
  const [configKey, sockets = []] = config
  const { socketValues = defaultValues, valueType = null } = fullConfig

  const addSocket = useCallback(
    socket => {
      const newValue = [
        ...sockets,
        {
          name: socket.name,
          valueType: socket.valueType,
        },
      ]

      updateConfigKey(configKey, newValue)
    },
    [sockets, configKey, updateConfigKey]
  )

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
        <AddNewSocket
          addSocket={addSocket}
          valueTypes={socketValues}
          definedValueType={valueType}
        />
      </div>
    </div>
  )
}

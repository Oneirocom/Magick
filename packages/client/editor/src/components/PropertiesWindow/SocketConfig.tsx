import { useCallback, useEffect, useState } from 'react'
import { ConfigurationComponentProps } from './PropertiesWindow'
import SingleElement from './SingleElement'

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'
import { useSnackbar } from 'notistack'
import { useReactFlow } from '@xyflow/react'
import { setEdges } from 'client/state'

/**
 * AddNewSocket component provides a form input to add a new socket.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.addSocket - Function to add a new socket.
 * @returns {React.JSX.Element} Form input to add a new socket.
 */
const AddNewSocket = ({ addSocket, valueTypes, definedValueType, sockets }) => {
  const [value, setValue] = useState('')
  const [selectedValueType, setSelectedValueType] = useState(valueTypes[0])
  const { enqueueSnackbar } = useSnackbar()

  /**
   * Update the input value when changed.
   *
   * @param {Event} e - The change event.
   */
  const onChange = e => {
    setValue(e.target.value)
  }

  useEffect(() => {
    if (definedValueType) {
      setSelectedValueType(definedValueType)
    } else {
      setSelectedValueType(valueTypes[0])
    }
  }, [definedValueType, valueTypes])

  /**
   * Add a new socket on form submission.
   *
   * @param {Event} e - The submit event.
   */
  const onAdd = e => {
    if (!value) return
    e.preventDefault()
    const socketExists = sockets.some(socket => socket.name === value)

    if (socketExists) {
      enqueueSnackbar('Socket already exists', {
        variant: 'error',
      })
      return
    }

    addSocket({ name: value, valueType: definedValueType || selectedValueType })
    setValue('')
    setSelectedValueType(valueTypes[0])
  }

  return (
    <form className="w-full mt-1">
      {/* Flexbox container for input field and add button */}
      <div className="flex h-20 mr-2">
        <div className="flex gap-2 items-center h-10 ">
          {/* Input field */}
          <Input
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
  node,
  config,
  updateConfigKey,
  fullConfig,
  tab,
}: ConfigurationComponentProps) => {
  const defaultValues = ['string', 'integer', 'boolean']
  const [configKey, sockets = []] = config
  const { socketValues = defaultValues, valueType = null } = fullConfig

  const instance = useReactFlow()

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
    const edges = instance.getEdges()

    const newEdges = edges.filter(edge => {
      if (configKey === 'socketInputs') {
        return edge.target !== node.id && edge.targetHandle !== name
      }

      if (configKey === 'socketOutputs') {
        return edge.source !== node.id && edge.sourceHandle !== name
      }

      return true
    })

    setEdges(tab.id, newEdges)

    const newValue = sockets.filter((socket: any) => socket.name !== name)
    updateConfigKey(configKey, newValue)
  }

  return (
    <div>
      {configKey === 'socketInputs' && <h3>Input Sockets</h3>}
      {configKey === 'socketOutputs' && <h3>Output Sockets</h3>}
      {sockets.map((socket: any, i) => (
        <SingleElement
          name={socket.name}
          key={socket.name + i}
          delete={deleteSocket}
          type={socket.valueType}
        />
      ))}
      <div>
        <AddNewSocket
          sockets={sockets}
          addSocket={addSocket}
          valueTypes={socketValues}
          definedValueType={valueType}
        />
      </div>
    </div>
  )
}

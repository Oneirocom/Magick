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
import { InputSocketSpecJSON } from '@magickml/behave-graph'
import { MagickEdgeType, MagickNodeType } from '@magickml/client-types'

export type AddedSocket = {
  name: string
  valueType: string
  description?: string // Added description field
}

type Props = {
  addSocket: (socket: AddedSocket) => void
  valueTypes: string[]
  definedValueType: string | null
  sockets: any[]
  includeDescription?: boolean
}
/**
 * AddNewSocket component provides a form input to add a new socket.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.addSocket - Function to add a new socket.
 * @returns {React.JSX.Element} Form input to add a new socket.
 */

export const AddNewSocket = ({
  addSocket,
  valueTypes,
  definedValueType,
  sockets,
  includeDescription = false, // New prop to include description field
}: Props) => {
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('') // State for description
  const [selectedValueType, setSelectedValueType] = useState(valueTypes[0])
  const { enqueueSnackbar } = useSnackbar()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  useEffect(() => {
    if (definedValueType) {
      setSelectedValueType(definedValueType)
    } else {
      setSelectedValueType(valueTypes[0])
    }
  }, [definedValueType, valueTypes])

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value) return
    const socketExists = sockets.some(socket => socket.name === value)

    if (socketExists) {
      enqueueSnackbar('Socket already exists', {
        variant: 'error',
      })
      return
    }

    addSocket({
      name: value,
      valueType: definedValueType || selectedValueType,
      description: includeDescription ? description : undefined, // Pass description if included
    })
    setValue('')
    setDescription('') // Reset description
    setSelectedValueType(valueTypes[0])
  }

  return (
    <form className="w-full mt-1" onSubmit={onAdd}>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <Input
            value={value}
            type="text"
            onChange={onChange}
            required
            placeholder="Add new socket"
            className="w-full h-8 pl-2 input-placeholder bg-[var(--dark-3)] border-[var(--dark-3)] m-0"
          />
          {!definedValueType && (
            <Select
              value={selectedValueType}
              onValueChange={value => setSelectedValueType(value)}
            >
              <SelectTrigger className="h-8 pl-2 text-xs pr-1 font-medium border-0 bg-[var(--dark-1)] w-28">
                <SelectValue placeholder="Select a type">
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
          <Button
            type="submit"
            className="h-8 w-8 border border-[var(--dark-3)] bg-ds-neutral rounded-sm"
          >
            +
          </Button>
        </div>
        {includeDescription && (
          <Input
            value={description}
            type="text"
            onChange={onDescriptionChange}
            placeholder="Socket description"
            className="w-full h-8 pl-2 input-placeholder bg-[var(--dark-3)] border-[var(--dark-3)] m-0"
          />
        )}
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

  const instance = useReactFlow<MagickNodeType, MagickEdgeType>()

  const addSocket = useCallback(
    (socket: InputSocketSpecJSON) => {
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
        return !(edge.target === node.id && edge.targetHandle === name)
      }

      if (configKey === 'socketOutputs') {
        return !(edge.source === node.id && edge.sourceHandle === name)
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
      {sockets.map((socket: any, i: number) => (
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

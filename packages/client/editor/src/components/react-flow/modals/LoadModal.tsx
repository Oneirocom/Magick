import React, { useState, useEffect } from 'react'
import { GraphJSON } from '@magickml/behave-graph'
import { useReactFlow } from 'reactflow'
import { Modal } from './Modal'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@magickml/client-ui' // Assuming a similar API

export type Examples = {
  [key: string]: GraphJSON
}

export type LoadModalProps = {
  open?: boolean
  onClose: () => void
  setBehaviorGraph: (value: GraphJSON) => void
  examples: Examples
}

export const LoadModal: React.FC<LoadModalProps> = ({
  open = false,
  onClose,
  setBehaviorGraph,
  examples,
}) => {
  const [value, setValue] = useState<string>()
  const [selected, setSelected] = useState('')

  const instance = useReactFlow()

  useEffect(() => {
    if (selected) {
      setValue(JSON.stringify(examples[selected], null, 2))
    }
  }, [selected, examples])

  const handleLoad = () => {
    let graph: GraphJSON | undefined
    if (value) {
      graph = JSON.parse(value)
    } else if (selected) {
      graph = examples[selected]
    }

    if (!graph) return

    setBehaviorGraph(graph)

    // Better way to call fit view after edges render
    setTimeout(() => {
      instance.fitView()
    }, 100)

    handleClose()
  }

  const handleClose = () => {
    setValue(undefined)
    setSelected('')
    onClose()
  }

  return (
    <Modal
      title="Load Graph"
      actions={[
        { label: 'Cancel', onClick: handleClose },
        { label: 'Load', onClick: handleLoad },
      ]}
      open={open}
      onClose={onClose}
    >
      <textarea
        autoFocus
        className="border border-gray-300 w-full p-2 h-32 align-top"
        placeholder="Paste JSON here"
        value={value || ''}
        onChange={e => setValue(e.currentTarget.value)}
      ></textarea>
      <div className="p-4 text-center text-gray-800">or</div>
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger>
          <SelectValue placeholder="Select an example" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(examples).map(key => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Modal>
  )
}

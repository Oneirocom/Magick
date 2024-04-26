import { NodeJSON, NodeSpecJSON } from '@magickml/behave-graph'
import React, { useEffect, useState } from 'react'
import {
  NodeProps as FlowNodeProps,
  useEdges,
  useUpdateNodeInternals,
} from 'reactflow'
import InputSocket from '../sockets/input-socket'
import OutputSocket from '../sockets/output-socket'
import { useChangeNodeData } from '../hooks/useChangeNodeData'
import { isHandleConnected } from '../utils/isHandleConnected'
import { SpellInterfaceWithGraph } from 'server/schemas'
import { getConfig } from '../utils/getNodeConfig'
import { configureSockets } from '../utils/configureSockets'
import { debounce } from 'lodash'
import NodeContainer from './node-container'

type BaseNodeProps = FlowNodeProps & {
  spec: NodeSpecJSON
  allSpecs: NodeSpecJSON[]
  spell: SpellInterfaceWithGraph
  nodeJSON: NodeJSON
  selected: boolean
  activeInput: {
    nodeId: string
    name: string
    value: any
    inputType: string
  } | null
  setActiveInput: (input: { nodeId: string; name: string } | null) => void
  onResetNodeState: () => void
  spellEvent: any
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  data,
  spec,
  selected,
  allSpecs,
  spell,
  nodeJSON,
  activeInput,
  setActiveInput,
  onResetNodeState,
  spellEvent,
}: BaseNodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals()
  const [endEventName, setEndEventName] = useState<string | null>(null)
  const [startEventName, setStartEventName] = useState<string | null>(null)
  const [errorEventName, setErrorEventName] = useState<string | null>(null)
  const [lastInputs, setLastInputs] = useState<Record<string, any> | null>(null)
  const [lastOutputs, setLastOutputs] = useState<Record<string, any> | null>(
    null
  )
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const edges = useEdges()
  const handleChange = useChangeNodeData(id)

  useEffect(() => {
    if (!selected) setActiveInput(null)
  }, [selected])

  const DELAY = 3000

  const debounceDone = debounce(() => {
    setDone(false)
  }, DELAY)

  // if the node doesn't have a config yet, we need to make one for it and add it to the react flow node data
  if (!data.configuration) {
    const config = getConfig(nodeJSON, spec)
    handleChange('configuration', config)
  }

  if (!data.nodeSpec) {
    handleChange('nodeSpec', spec)
  }

  useEffect(() => {
    updateNodeInternals(id)
  }, [data])

  const { configuration: config } = data
  const { pairs, valueInputs } = configureSockets(data, spec)

  useEffect(() => {
    if (!spell || !id) return
    setEndEventName(`${spell.id}-${id}-end`)
    setStartEventName(`${spell.id}-${id}-start`)
    setErrorEventName(`${spell.id}-${id}-error`)
  }, [spell, id])

  // Handle start event
  useEffect(() => {
    if (!spellEvent) return
    if (spellEvent.event === startEventName) {
      setLastInputs(spellEvent.inputs)
      setRunning(true)
    }
  }, [spellEvent])

  // Handle end event
  useEffect(() => {
    if (!spellEvent) return
    if (spellEvent.event === endEventName) {
      setLastOutputs(spellEvent.outputs)
      setRunning(false)
      setDone(true)

      debounceDone()
    }
  }, [spellEvent])

  // Handle error event
  useEffect(() => {
    if (!spellEvent) return
    if (spellEvent.event === errorEventName) {
      setRunning(false)
      setError(spellEvent)

      setTimeout(() => {
        setError(false)
      }, 5000)
    }
  }, [spellEvent])

  const isActive = (x: string) => {
    if (activeInput?.nodeId !== id) return false
    return activeInput?.name === x
  }

  return (
    <NodeContainer
      fired={done}
      error={error}
      running={running}
      label={config?.label ?? spec.label}
      title={spec?.type ?? 'Node'}
      category={spec.category}
      selected={selected}
      graph={spell.graph}
      config={config}
    >
      {pairs.map(([flowInput, output], ix) => (
        <div
          key={ix}
          className="flex flex-row justify-between gap-8 relative px-2"
        >
          {flowInput && (
            <InputSocket
              {...flowInput}
              specJSON={allSpecs}
              value={data[flowInput.name] ?? flowInput.defaultValue}
              onChange={handleChange}
              connected={isHandleConnected(edges, id, flowInput.name, 'target')}
              nodeId={id}
              isActive={isActive(flowInput.name)}
              activeInput={activeInput}
              setActiveInput={setActiveInput}
            />
          )}
          {output && (
            <OutputSocket
              {...output}
              specJSON={allSpecs}
              lastEventOutput={
                lastOutputs
                  ? lastOutputs.find((event: any) => event.name === output.name)
                      ?.value
                  : undefined
              }
              connected={isHandleConnected(edges, id, output.name, 'source')}
            />
          )}
        </div>
      ))}

      {valueInputs.map((input, ix) => (
        <div
          key={ix}
          className="flex flex-row justify-start gap-8 relative px-2"
        >
          <InputSocket
            {...input}
            specJSON={allSpecs}
            value={data[input.name] ?? input.defaultValue}
            lastEventInput={
              lastInputs
                ? lastInputs.find((event: any) => {
                    return event.name === input.name
                  })?.value
                : undefined
            }
            onChange={handleChange}
            connected={isHandleConnected(edges, id, input.name, 'target')}
            nodeId={id}
            isActive={isActive(input.name)}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        </div>
      ))}
    </NodeContainer>
  )
}

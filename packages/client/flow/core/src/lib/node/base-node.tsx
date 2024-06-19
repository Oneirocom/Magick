'use client'

import { NodeSpecJSON } from '@magickml/behave-graph'
import React, { useEffect, useMemo, useState } from 'react'
import { NodeProps as FlowNodeProps, useEdges } from '@xyflow/react'
import InputSocket from '../sockets/input-socket'
import OutputSocket from '../sockets/output-socket'
import { useChangeNodeData } from '../hooks/useChangeNodeData'
import { isHandleConnected } from '../utils/isHandleConnected'
import { configureSockets } from '../utils/configureSockets'
import NodeContainer from './node-container'
import { MagickNodeType } from '@magickml/client-types'

type BaseNodeProps = FlowNodeProps<MagickNodeType> & {
  spec: NodeSpecJSON
  allSpecs: NodeSpecJSON[]
  spellId: string
  resetNodeState?: boolean
  selected?: boolean | undefined
  onResetNodeState: () => void
  spellEvent: any
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  data,
  spec,
  selected,
  allSpecs,
  spellId,
  resetNodeState = false,
  onResetNodeState,
  spellEvent,
}: BaseNodeProps) => {
  const [socketsVisible, setSocketsVisible] = useState(true)
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
    if (typeof data.socketsVisible === 'undefined') {
      setSocketsVisible(true)
      return
    }

    setSocketsVisible(data.socketsVisible)
  }, [data.socketsVisible])

  useEffect(() => {
    if (resetNodeState) {
      setRunning(false)
      setDone(false)
      setError(false)
      onResetNodeState()
    }
  }, [resetNodeState])

  useEffect(() => {
    if (!data.nodeSpec) {
      handleChange('nodeSpec', spec)
    }
  }, [data])

  const { configuration: config } = data
  const { pairs, valueInputs } = useMemo(
    () => configureSockets(data, spec),
    [data, spec]
  )

  useEffect(() => {
    if (!spellId || !id) return
    setEndEventName(`${spellId}-${id}-end`)
    setStartEventName(`${spellId}-${id}-start`)
    setErrorEventName(`${spellId}-${id}-error`)
  }, [spellId, id])

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

      setTimeout(() => {
        setRunning(false)
        setDone(true)
      }, 2000)
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

  const toggleSocketVisibility = () => {
    const newState = !socketsVisible
    setSocketsVisible(newState)
    handleChange('socketsVisible', newState)
  }

  return (
    <NodeContainer
      fired={done}
      error={error}
      running={running}
      nodeTitle={data?.nodeTitle}
      label={spec.label}
      title={spec?.type ?? 'Node'}
      category={spec.category}
      selected={selected}
      socketsVisible={socketsVisible}
      toggleSocketVisibility={toggleSocketVisibility}
      config={config}
      handleChange={handleChange}
    >
      {pairs.map(([flowInput, output], ix) => (
        <div
          key={`pair-${ix}`}
          className="flex flex-row justify-between gap-8 relative px-2"
        >
          {flowInput && (
            <InputSocket
              key={`input-${flowInput.name}`}
              {...flowInput}
              specJSON={allSpecs}
              value={data[flowInput.name] ?? flowInput.defaultValue}
              onChange={handleChange}
              connected={isHandleConnected(edges, id, flowInput.name, 'target')}
              nodeId={id}
            />
          )}
          {output && (
            <OutputSocket
              key={`output-${output.name}`}
              {...output}
              specJSON={allSpecs}
              hide={!socketsVisible}
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
          key={`valueInput-${ix}`}
          className="flex flex-row justify-start gap-8 relative px-2"
        >
          <InputSocket
            key={`valueInput-${input.name}`}
            {...input}
            specJSON={allSpecs}
            hide={!socketsVisible}
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
          />
        </div>
      ))}
    </NodeContainer>
  )
}

import { NodeJSON, NodeSpecJSON } from '@magickml/behave-graph'
import React, { useEffect, useState } from 'react'
import {
  NodeProps as FlowNodeProps,
  useEdges,
  useUpdateNodeInternals,
} from 'reactflow'

import InputSocket from './InputSocket'
import NodeContainer from './NodeContainer'
import OutputSocket from './OutputSocket'
import { useChangeNodeData } from '../../hooks/react-flow/useChangeNodeData'
import { isHandleConnected } from '../../utils/isHandleConnected'
import { useSelectAgentsSpell } from 'client/state'
import { SpellInterface } from 'server/schemas'
import { getConfig } from '../../utils/getNodeConfig'
import { configureSockets } from '../../utils/configureSockets'
import { enqueueSnackbar } from 'notistack'
import { debounce } from 'lodash'
import { Tab, usePubSub } from '@magickml/providers'

type NodeProps = FlowNodeProps & {
  tab: Tab
  spec: NodeSpecJSON
  allSpecs: NodeSpecJSON[]
  spell: SpellInterface
  nodeJSON: NodeJSON
}

export const Node: React.FC<NodeProps> = ({
  id,
  tab,
  data,
  spec,
  selected,
  allSpecs,
  spell,
  nodeJSON,
}: NodeProps) => {
  const { events, subscribe } = usePubSub()
  const updateNodeInternals = useUpdateNodeInternals()
  const { lastItem: spellEvent } = useSelectAgentsSpell()
  const [endEventName, setEndEventName] = useState<string | null>(null)
  const [startEventName, setStartEventName] = useState<string | null>(null)
  const [errorEventName, setErrorEventName] = useState<string | null>(null)
  // const [commitEventname, setCommitEventName] = useState<string | null>(null)
  const [lastInputs, setLastInputs] = useState<Record<string, any> | null>(null)
  const [lastOutputs, setLastOutputs] = useState<Record<string, any> | null>(
    null
  )

  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const edges = useEdges()
  const handleChange = useChangeNodeData(id)

  // Hook into to event to reset node states and stop animations
  useEffect(() => {
    const unsubscribe = subscribe(events.RESET_NODE_STATE, () => {
      setRunning(false)
      setDone(false)
      setError(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

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
    // setCommitEventName(`${spell.id}-${id}-commit`)
  }, [spell, id])

  // Handle commit event
  // useEffect(() => {
  //   if (!spellEvent) return;
  //   if (spellEvent.event === commitEventname) {
  //     const commitedSocket = spellEvent.socket

  //     const connectedEdge = edges.find(edge => {
  //       return edge.source === id && edge.sourceHandle === commitedSocket
  //     })

  //     if (!connectedEdge) return;

  //     setEdges(tab.id, edges => {
  //       const newEdges = edges.map(edge => {
  //         if (edge.id === connectedEdge.id) {
  //           return {
  //             ...edge,
  //             animated: true,
  //             style: {
  //               stroke: 'white'
  //             }
  //           }
  //         }

  //         return edge
  //       })

  //       return newEdges
  //     })

  //     debounceAnimateEdgeDone(connectedEdge)
  //   }

  // }, [spellEvent])

  // Handle start event
  useEffect(() => {
    if (!spellEvent) return
    if (spellEvent.event === startEventName) {
      setLastInputs(spellEvent.inputs)
      console.log('start event', spellEvent)
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

      const truncatedMessage =
        spellEvent.message.length > 100
          ? spellEvent.message.substring(
              0,
              spellEvent.message.lastIndexOf(' ', 10)
            ) + '...'
          : spellEvent.message

      enqueueSnackbar(truncatedMessage, {
        variant: 'error',
      })

      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }, [spellEvent])

  return (
    <NodeContainer
      fired={done}
      error={error}
      running={running}
      title={spec.label}
      category={spec.category}
      selected={selected}
      graph={spell.graph}
      config={config}
    >
      {pairs.map(([flowInput, output], ix) => (
        <div
          key={ix}
          className="flex flex-row justify-between gap-8 relative px-2"
          // className={styles.container}
        >
          {flowInput && (
            <InputSocket
              {...flowInput}
              specJSON={allSpecs}
              value={data[flowInput.name] ?? flowInput.defaultValue}
              onChange={handleChange}
              connected={isHandleConnected(edges, id, flowInput.name, 'target')}
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
          // className={styles.container}
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
          />
        </div>
      ))}
    </NodeContainer>
  )
}

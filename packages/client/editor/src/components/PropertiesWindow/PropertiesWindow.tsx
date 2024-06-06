import cx from 'classnames'
import { getNodeSpec } from 'shared/nodeSpec'
import { Tab, useConfig } from '@magickml/providers'
import { useGetSpellByNameQuery } from 'client/state'
import { Window } from 'client/core'
import { SocketConfig } from './SocketConfig'
import { GraphSocketJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { Node, useOnSelectionChange } from '@xyflow/react'
import { useChangeNodeData } from '@magickml/flow-core'
import { EventStateProperties } from './EventStateProperties'
import { SpellInterface } from 'server/schemas'
import { VariableNames } from './variableNames'
import { ValueType } from './ValueType'
import { DefaultConfig } from './DefaultConfig'
import { CompletionProviderOptions } from './CompletionProviderOptions'
import { SelectedEvents } from './SelectedEvents'
import { useEffect, useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'
import { makeEmbedderClient } from '@magickml/embedder/client/ts'
import toast from 'react-hot-toast'
import { SubspellSocketConfig } from './SubspellSocketConfig'
import { SelectSpell } from './SelectSpell'

import { PackSchema } from '@magickml/embedder/schema'
import { z } from 'zod'

type Pack = z.infer<typeof PackSchema> & {
  loaders: {
    id: string
    name: string
  }[]
}

type Props = {
  tab: Tab
  spellId: string
  spellName: string
}

export type ConfigurationComponentProps = {
  fullConfig: Record<string, any>
  config: [key: string, value: any]
  nodeSpec: NodeSpecJSON
  node: Node
  valueType: string
  updateConfigKey: (key: string, value: any) => void
  updateConfigKeys: (keys: Record<string, any>) => void
  spell: SpellInterface
  tab: Tab
}

const ConfigurationComponents = {
  socketInputs: SocketConfig,
  socketOutputs: SocketConfig,
  eventStateProperties: EventStateProperties,
  variableNames: VariableNames,
  valueType: ValueType,
  default: DefaultConfig,
  modelProviders: CompletionProviderOptions,
  selectedEvents: SelectedEvents,
  spellId: SelectSpell,
}

enum KnowledgeNodeTypes {
  ADD_SOURCE = 'knowledge/embedder/addSource',
}

export const PropertiesWindow = (props: Props) => {
  /* STATE */

  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [spec, setSpec] = useState<NodeSpecJSON | null>(null)
  const [currentNode, setCurrentNode] = useState<Node | null>(null)
  const [configuration, setConfiguration] = useState<Record<
    string,
    any
  > | null>(null)

  /* KNOWLEDGE PACK STUFF */
  // TODO: Move this to a separate component

  const client = makeEmbedderClient(useConfig().embedderToken)
  const [knowledgePacks, setKnowledgePacks] = useState<Pack[] | null>(null)

  // not using query client here its breaking rules of hooks somewhere
  const fetchKnowledgePacks = async () => {
    try {
      const packs = await client.getPacksByEntityAndOwner()
      setKnowledgePacks(packs as Pack[])
    } catch (error) {
      toast.error('Failed to fetch knowledge packs')
    }
  }
  // if the knowledge packs are not loaded yet, fetch them
  useEffect(() => {
    if (!knowledgePacks) {
      fetchKnowledgePacks()
    }
  }, [knowledgePacks])

  // if the node changes and is addSource, fetch the knowledge packs again
  useEffect(() => {
    if (selectedNode && selectedNode.type === KnowledgeNodeTypes.ADD_SOURCE) {
      fetchKnowledgePacks()
    }
  }, [selectedNode])

  /* REACTIVITY */

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length > 1) {
        setSelectedNode(null)
        return
      }
      setSelectedNode(nodes[0])
    },
  })

  const spellName = props.spellName
  const { spell } = useGetSpellByNameQuery(
    { spellName },
    {
      skip: !spellName,
      selectFromResult: data => ({
        spell: data?.data?.data[0],
      }),
    }
  )

  const handleChange = useChangeNodeData(selectedNode?.id)

  const nodeSpecs = useMemo(() => getNodeSpec(), [])

  useEffect(() => {
    if (!nodeSpecs) return

    if (!selectedNode) {
      setCurrentNode(null)
      setSpec(null)
      return
    }

    const { configuration } = selectedNode.data
    if (configuration) setConfiguration(configuration)

    const spec = nodeSpecs.find(spec => spec.type === selectedNode.type)

    setSpec(spec || null)

    setCurrentNode(selectedNode)
  }, [selectedNode, nodeSpecs])

  const updateConfigKey = (key: string, value: any) => {
    const newConfig = {
      ...configuration,
      [key]: value,
    }
    setConfiguration(newConfig)
    handleChange('configuration', newConfig)
  }

  const updateConfigKeys = (keys: Record<string, any>) => {
    const newConfig = {
      ...configuration,
      ...keys,
    }
    setConfiguration(newConfig)
    handleChange('configuration', newConfig)
  }

  const [inputSockets, setInputSockets] = useState<GraphSocketJSON[]>([])
  const [outputSockets, setOutputSockets] = useState<GraphSocketJSON[]>([])

  useEffect(() => {
    if (!spell) return

    const inputSockets = spell.graph.graphInputs || []
    const outputSockets = spell.graph.graphOutputs || []

    setInputSockets(inputSockets)
    setOutputSockets(outputSockets)
  }, [spell])

  if (!spell) return null

  if (!configuration || !spec || !selectedNode) {
    return (
      <Window borderless>
        <SubspellSocketConfig
          getSockets={sockets =>
            sockets.filter(socket => socket.valueType === 'flow')
          }
          type="input"
          socketValues={['flow']}
          sockets={inputSockets}
          setSockets={setInputSockets}
          graph={spell.graph}
          tab={props.tab}
          title="Flow Inputs"
        />
        <SubspellSocketConfig
          getSockets={sockets =>
            sockets.filter(socket => socket.valueType === 'flow')
          }
          type="output"
          sockets={outputSockets}
          setSockets={setOutputSockets}
          socketValues={['flow']}
          graph={spell.graph}
          tab={props.tab}
          title="Flow Outputs"
        />
        <SubspellSocketConfig
          getSockets={sockets =>
            sockets.filter(socket => socket.valueType !== 'flow')
          }
          type="input"
          sockets={inputSockets}
          setSockets={setInputSockets}
          graph={spell.graph}
          tab={props.tab}
          title="Data Inputs"
        />

        <SubspellSocketConfig
          getSockets={sockets =>
            sockets.filter(socket => socket.valueType !== 'flow')
          }
          type="output"
          sockets={outputSockets}
          setSockets={setOutputSockets}
          graph={spell.graph}
          tab={props.tab}
          title="Data Outputs"
        />
      </Window>
    )
  }

  const getActiveKnowledgePack = (knowledgePacks || []).find(
    pack => pack.id === configuration.packId
  )

  return (
    <Window borderless>
      {spec && (
        <div className="px-4 py-4">
          <h2>{spec.label}</h2>
        </div>
      )}

      {
        Object.entries(configuration || {})
          .filter(
            ([key, value]) =>
              !configuration.hiddenProperties?.includes(key) &&
              !spec?.configuration
                .find(config => config.name === 'hiddenProperties')
                ?.defaultValue // @ts-ignore
                ?.includes(key)
          )
          .map((config: [key: string, any], index) => {
            const [key] = config
            const Component =
              ConfigurationComponents[
                key as keyof typeof ConfigurationComponents
              ] || ConfigurationComponents.default

            const valueType =
              spec.configuration.find(conf => conf.name === key)?.valueType ||
              'string'

            const componentProps: ConfigurationComponentProps = {
              spell,
              fullConfig: configuration,
              config: config,
              nodeSpec: spec,
              node: currentNode as Node,
              tab: props.tab,
              updateConfigKey,
              updateConfigKeys,
              valueType,
            }

            const isFirstElement = index === 0
            const borderClass = cx(
              'border-solid border-0 border-b border-[var(--background-color)] pl-4 pr-2 py-4',
              isFirstElement && 'border-t'
            )

            return (
              <div key={key + index} className={borderClass}>
                <Component {...componentProps} />
              </div>
            )
          }) as any
      }
      {Object.entries(configuration || {})
        .filter(([key]) => key === 'packId')
        .map((config: [key: string, any]) => (
          <div className="px-4 py-2" key={config[0]}>
            <label htmlFor="packId">Knowledge Pack</label>
            <div className="flex items-center">
              <p className="mr-2">Select a knowledge pack</p>
              <p className="text-sm text-gray-400">
                (This will be used to load data from)
              </p>
            </div>
            <Select
              value={configuration?.packId || 'packId'}
              defaultValue="packId"
              onValueChange={e => updateConfigKey('packId', e)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="packId">Knowledge packs</SelectItem>

                {knowledgePacks?.map(pack => (
                  <SelectItem key={pack.id} value={pack.id}>
                    {pack.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

      {Object.entries(configuration || {})
        .filter(([key]) => key === 'loaderId')
        .map((config: [key: string, any]) => (
          <div className="px-4 py-2" key={config[0]}>
            <label htmlFor="packId">Knowledge Entry</label>
            <div className="flex items-center">
              <p className="mr-2">Select a knowledge entry</p>
              <p className="text-sm text-gray-400">
                (What document do you want get data from?)
              </p>
            </div>
            <Select
              value={configuration?.loaderId || 'loaderId'}
              defaultValue="loaderId"
              onValueChange={e => updateConfigKey('loaderId', e)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loaderId">Knowledge Entry</SelectItem>

                {getActiveKnowledgePack?.loaders?.map(loader => (
                  <SelectItem key={loader.id} value={loader.id}>
                    {loader.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
    </Window>
  )
}

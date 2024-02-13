import cx from 'classnames'
import { getNodeSpec } from 'shared/nodeSpec'
import { Tab } from '@magickml/providers'
import { selectActiveNode, useGetSpellByNameQuery } from 'client/state'
import { useSelector } from 'react-redux'
import { Window } from 'client/core'
import { SocketConfig } from './SocketConfig'
import { NodeSpecJSON } from '@magickml/behave-graph'
import { Node } from 'reactflow'
import { useChangeNodeData } from '../../hooks/react-flow/useChangeNodeData'
import { EventStateProperties } from './EventStateProperties'
import { SpellInterface } from 'server/schemas'
import { VariableNames } from './variableNames'
import { ValueType } from './ValueType'
import { DefaultConfig } from './DefaultConfig'
import { CompletionProviderOptions } from './CompletionProviderOptions'
import { SelectedEvents } from './SelectedEvents'

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
  textEditorData: () => <div>Button to open text editor</div>,
  eventStateProperties: EventStateProperties,
  variableNames: VariableNames,
  valueType: ValueType,
  default: DefaultConfig,
  modelProviders: CompletionProviderOptions,
  selectedEvents: SelectedEvents,
}

export const PropertiesWindow = (props: Props) => {
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

  const nodeSpecs = getNodeSpec()
  const selectedNode = useSelector(selectActiveNode(props.tab.id))
  const handleChange = (key: string, value: any) => {
    if (!selectedNode) return
    useChangeNodeData(selectedNode?.id)
  }

  if (!selectedNode) return null

  const spec = nodeSpecs.find(spec => spec.type === selectedNode.type)
  const { configuration } = selectedNode.data
  const hiddenProperties = configuration.hiddenProperties || []

  if (!spell || !spec) return null

  const updateConfigKey = (key: string, value: any) => {
    const newConfig = {
      ...configuration,
      [key]: value,
    }
    handleChange('configuration', newConfig)
  }

  const updateConfigKeys = (keys: Record<string, any>) => {
    const newConfig = {
      ...configuration,
      ...keys,
    }
    handleChange('configuration', newConfig)
  }

  return (
    <Window borderless>
      {spec && (
        <div className="px-4 py-4">
          <h2>{spec.label}</h2>
        </div>
      )}
      {
        Object.entries(configuration || {})
          .filter(([key, value]) => !hiddenProperties.includes(key))
          .map((config: [key: string, any], index) => {
            const [key] = config
            const Component =
              ConfigurationComponents[key] || ConfigurationComponents.default

            const valueType =
              spec.configuration.find(conf => conf.name === key)?.valueType ||
              'string'

            const componentProps: ConfigurationComponentProps = {
              spell,
              fullConfig: configuration,
              config: config,
              nodeSpec: spec,
              node: selectedNode,
              tab: props.tab,
              updateConfigKey,
              updateConfigKeys,
              valueType,
            }

            // Check if the current element is the first or the last one in the array
            const isFirstElement = index === 0
            const borderClass = cx(
              'border-solid border-0 border-b border-[var(--background-color)] p-4',
              isFirstElement && 'border-t'
            )

            return (
              <div key={key + index} className={borderClass}>
                <Component {...componentProps} />
              </div>
            )
          }) as any
      }
    </Window>
  )
}

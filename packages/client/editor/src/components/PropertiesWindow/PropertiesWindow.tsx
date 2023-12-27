
import cx from 'classnames';
import { getNodeSpec } from 'shared/nodeSpec';
import { Tab } from "@magickml/providers"
import { selectActiveNode, useGetSpellByJustIdQuery } from "client/state"
import { useSelector } from "react-redux"
import { Window } from 'client/core';
import { SocketConfig } from './SocketConfig';
import { NodeSpecJSON } from '@magickml/behave-graph';
import { Node } from 'reactflow';
import { useChangeNodeData } from '../../hooks/react-flow/useChangeNodeData';
import { EventStateProperties } from './EventStateProperties';

type Props = {
  tab: Tab
  spellId: string
}

export type ConfigurationComponentProps = {
  fullConfig: Record<string, any>
  config: [key: string, value: any]
  nodeSpec: NodeSpecJSON
  node: Node,
  updateConfigKey: (key: string, value: any) => void
}

const ConfigurationComponents = {
  socketInputs: SocketConfig,
  textEditorData: () => <div>Button to open text editor</div>,
  eventStateProperties: EventStateProperties,
  default: () => <div>default</div>
}

export const PropertiesWindow = (props: Props) => {
  const { data: spellData } = useGetSpellByJustIdQuery({ id: props.spellId })
  const nodeSpecs = getNodeSpec()
  const selectedNode = useSelector(selectActiveNode(props.tab.id))
  const handleChange = useChangeNodeData(selectedNode?.id);

  if (!selectedNode) return null

  const spec = nodeSpecs.find(spec => spec.type === selectedNode.type)
  const { configuration } = selectedNode.data
  const hiddenProperties = configuration.hiddenProperties || []

  if (!spellData || !spec) return null

  const updateConfigKey = (key: string, value: any) => {
    const newConfig = {
      ...configuration,
      [key]: value
    }
    handleChange('configuration', newConfig)
  }

  return (
    <Window borderless>
      {spec && <div className="px-4 py-4">
        <h2>{spec.label}</h2>
      </div>}
      {Object.entries(configuration || {}).filter(([key]) => !hiddenProperties.includes(key)).map((config: [key: string, Record<string, any>], index) => {
        const [key] = config
        const Component = ConfigurationComponents[key] || ConfigurationComponents.default

        const componentProps: ConfigurationComponentProps = {
          fullConfig: configuration,
          config: config,
          nodeSpec: spec,
          node: selectedNode,
          updateConfigKey
        }

        // Check if the current element is the first or the last one in the array
        const isFirstElement = index === 0;
        const borderClass = cx(
          "border-solid border-0 border-b border-[var(--background-color)] p-4",
          isFirstElement && "border-t",
        )

        return (
          <div className={borderClass}>
            <Component {...componentProps} />
          </div>
        )
      }) as any}
    </Window>
  )
}
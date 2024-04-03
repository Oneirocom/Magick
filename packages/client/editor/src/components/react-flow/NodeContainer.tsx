import {
  NodeCategory,
  NodeSpecJSON,
  VariableJSON,
} from '@magickml/behave-graph'
import cx from 'classnames'
import React, { PropsWithChildren } from 'react'

import {
  categoryColorMap,
  categoryIconMap,
  colors,
  valueTypeColorMap,
} from '../../utils/colors'
import { SpellInterface } from 'server/schemas'

import css from './node.module.css'

type Config = {
  label?: string
  variableId?: string
}

type NodeProps = {
  title: string
  label: string
  category?: NodeSpecJSON['category']
  selected: boolean
  onClick?: () => void
  fired: boolean
  error: boolean
  running: boolean
  config: Config
  graph: SpellInterface['graph']
}

const NodeContainer: React.FC<PropsWithChildren<NodeProps>> = ({
  title,
  category = NodeCategory.None,
  selected,
  children,
  fired,
  label,
  config,
  running,
  graph,
  error,
}) => {
  let colorName = categoryColorMap[category]
  if (colorName === undefined) {
    colorName = 'red'
  }

  const NodeIcon = categoryIconMap[category]

  let [backgroundColor, textColor] = colors[colorName]

  if (config?.variableId) {
    const variable = graph.variables.find(
      variable => variable.id === config.variableId
    ) as VariableJSON
    if (variable) {
      const colorName = valueTypeColorMap[variable.valueTypeName]
      if (colorName) {
        ;[backgroundColor, textColor] = colors[colorName]
      }
    }
  }

  return (
    <div className="p-5">
      <div className={cx('relative')}>
        <div
          className={cx(
            'rounded text-white text-sm bg-[var(--foreground-color)] w-[250px] transition-all duration-300 opacity-100',
            selected && 'outline outline-1',
            fired && 'outline outline-2 outline-green-500',
            running && css.running,
            error && 'outline outline-2 outline-red-500'
          )}
        >
          <div
            className={cx(
              `${backgroundColor} ${textColor} px-2 py-0.5 rounded-t opacity-100 flex flex-row gap-1 items-center`
            )}
          >
            <div className="flex mr-1">
              <NodeIcon width={24} height={24} />
            </div>
            <div>
              <h2 className="text-md font-medium">{label}</h2>
              <h3 className="text-xs">{title}</h3>
            </div>
          </div>
          <div className={`flex flex-col gap-1 py-1`}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default NodeContainer

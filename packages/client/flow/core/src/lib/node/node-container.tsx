import { NodeCategory, NodeSpecJSON } from '@magickml/behave-graph'
import { cn } from '@magickml/client-ui'
import { type PropsWithChildren } from 'react'

import {
  categoryColorMap,
  categoryIconMap,
  colors,
  valueTypeColorMap,
} from '../utils/colors'

type Config = {
  label?: string
  variableId?: string
  valueTypeName?: string
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
}

const NodeContainer: React.FC<PropsWithChildren<NodeProps>> = ({
  title,
  category = NodeCategory.None,
  selected,
  children,
  label,
  config,
  running,
  error,
}) => {
  let colorName = categoryColorMap[category]
  if (colorName === undefined) {
    colorName = 'red'
  }

  const NodeIcon = categoryIconMap[category]

  let [backgroundColor, textColor] = colors[colorName]

  if (config?.valueTypeName) {
    const colorName = valueTypeColorMap[config.valueTypeName]
    if (colorName) {
      ;[backgroundColor, textColor] = colors[colorName]
    }
  }
  // }

  return (
    <div className="p-3">
      <div className={cn('relative')}>
        <div
          className={cn(
            'rounded text-white text-sm bg-[var(--foreground-color)] w-[250px] transition-all duration-300 opacity-100',
            selected && 'outline outline-1',
            running && 'outline outline-2 outline-green-500',
            // running && css.running,
            error && 'outline outline-2 outline-red-500'
          )}
        >
          <div
            className={cn(
              `${backgroundColor} ${textColor} px-2 py-1 rounded-t opacity-100 flex`
            )}
          >
            <div className="flex items-center mr-1">
              <NodeIcon width={24} height={24} />
            </div>
            <div className="ml-1 truncate">
              <h2 className="text-md font-medium">{label}</h2>
              <p className="text-xs truncate">{title}</p>
            </div>
          </div>
          <div className={`flex flex-col gap-1 py-1`}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default NodeContainer

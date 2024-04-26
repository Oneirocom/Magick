import {
  NodeCategory,
  NodeSpecJSON,
  VariableJSON,
} from '@magickml/behave-graph'
import React, { PropsWithChildren } from 'react'
import { categoryColorMap, colors, valueTypeColorMap } from '../utils/colors'
import { SpellInterface } from 'server/schemas'
import {
  BackgroundGradient,
  successGradient,
  errorGradient,
  processingGradient,
  selectedGradient,
  MovingBorder,
  successBorderGradient,
  errorBorderGradient,
  processingBorderGradient,
  cn,
} from '@magickml/client-ui'

type Config = {
  label?: string
  variableId?: string
}

type NodeProps = {
  title: string
  category?: NodeSpecJSON['category']
  selected: boolean
  onClick?: () => void
  fired: boolean
  error: boolean
  running: boolean
  config: Config
  graph: SpellInterface['graph']
}

export const NodeContainerV2: React.FC<PropsWithChildren<NodeProps>> = ({
  title,
  category = NodeCategory.None,
  selected,
  children,
  fired,
  config,
  running,
  graph,
  error,
}) => {
  let colorName = categoryColorMap[category]
  if (colorName === undefined) {
    colorName = 'red'
  }
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

  const borderRadius = '.25rem'
  const duration = 2000

  return (
    <BackgroundGradient
      animate={running || fired || error}
      active={selected}
      gradient={
        fired
          ? successGradient
          : error
          ? errorGradient
          : running
          ? processingGradient
          : selected
          ? selectedGradient
          : selectedGradient
      }
      className="relative p-[1px] rounded-[calc(0.96 * 0.25rem)]"
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder
          duration={duration}
          rx="30%"
          ry="30%"
          animate={fired || error || running}
        >
          <div
            className={cn(
              'h-20 w-20 opacity-[0.8]',
              fired
                ? successBorderGradient
                : error
                ? errorBorderGradient
                : processingBorderGradient
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn('relative')}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <div
          className={cn(
            'text-white text-sm bg-[var(--foreground-color)] w-[220px] transition-all duration-300 opacity-100'
            // selected && !running && !fired && !error && 'outline outline-1'
          )}
          style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
        >
          <div
            className={cn(
              `${textColor} ${backgroundColor} px-2 py-1  opacity-100`
            )}
            style={{
              borderTopLeftRadius: `calc(${borderRadius} * 0.96)`,
              borderTopRightRadius: `calc(${borderRadius} * 0.96)`,
            }}
          >
            {title}
            {config?.label && ` - ${config.label}`}
          </div>
          <div className={`flex flex-col gap-1 py-1`}>{children}</div>
        </div>
      </div>
    </BackgroundGradient>
  )
}

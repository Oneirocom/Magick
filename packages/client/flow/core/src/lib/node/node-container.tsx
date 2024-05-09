import { NodeCategory, NodeSpecJSON } from '@magickml/behave-graph'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { cn } from '@magickml/client-ui'
import { type PropsWithChildren, useState } from 'react'
import {
  categoryColorMap,
  categoryIconMap,
  colors,
  valueTypeColorMap,
} from '../utils/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Config = {
  label?: string
  variableId?: string
  valueTypeName?: string
  socketOutputs: { name: string; valueType: string }[]
}

type NodeProps = {
  title: string
  label: string
  category?: NodeSpecJSON['category']
  selected: boolean
  onClick?: () => void
  socketsVisible: boolean
  toggleSocketVisibility: () => void
  fired: boolean
  error: boolean
  running: boolean
  config: Config
  nodeTitle?: string
  handleChange: (key: string, value: any) => void
}

const NodeContainer: React.FC<PropsWithChildren<NodeProps>> = ({
  title,
  category = NodeCategory.None,
  selected,
  children,
  label,
  config,
  running,
  socketsVisible,
  toggleSocketVisibility,
  error,
  nodeTitle,
  handleChange,
}) => {
  let innerLabel = label
  const [isEditing, setIsEditing] = useState(false)
  const [editedLabel, setEditedLabel] = useState(label)

  let colorName = categoryColorMap[category]
  if (colorName === undefined) {
    colorName = 'red'
  }
  const NodeIcon = categoryIconMap[category]
  let [backgroundColor, textColor] = colors[colorName]
  if (config?.valueTypeName) {
    const variableName = config.socketOutputs[0].name
    innerLabel = variableName && `${label} ${variableName}`
    const colorName = valueTypeColorMap[config.valueTypeName]
    if (colorName) {
      ;[backgroundColor, textColor] = colors[colorName]
    }
  }

  const handleLabelDoubleClick = () => {
    setIsEditing(true)
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedLabel(e.target.value)
  }

  const handleLabelBlur = () => {
    setIsEditing(false)
    handleChange('nodeTitle', editedLabel)
  }

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      handleChange('nodeTitle', editedLabel)
    }
  }

  return (
    <div className="p-3">
      <div className={cn('relative')}>
        <div
          className={cn(
            'rounded text-white text-sm bg-[var(--foreground-color)] w-[250px] transition-all duration-300 opacity-100',
            selected && 'outline outline-1',
            running && 'outline outline-2 outline-green-500',
            error && 'outline outline-2 outline-red-500'
          )}
        >
          <div
            className={cn(
              `${backgroundColor} ${textColor} px-2 py-1 rounded-t opacity-100 flex justify-between items-center`
            )}
          >
            <div className="flex items-center">
              <div className="flex items-center mr-1">
                <NodeIcon width={24} height={24} />
              </div>
              <div className="ml-1 truncate">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLabel}
                    onChange={handleLabelChange}
                    onBlur={handleLabelBlur}
                    onKeyDown={handleLabelKeyDown}
                    className="bg-transparent outline-none p-0 text-md font-medium cursor-text h-[18px] truncate"
                  />
                ) : (
                  <h2
                    className="text-md font-medium cursor-text truncate w-44"
                    onDoubleClick={handleLabelDoubleClick}
                  >
                    {nodeTitle ?? innerLabel}
                  </h2>
                )}
                <p className="text-xs truncate w-44">{title}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={socketsVisible ? faEye : faEyeSlash}
                onClick={toggleSocketVisibility}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className={`flex flex-col gap-1 py-1`}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default NodeContainer

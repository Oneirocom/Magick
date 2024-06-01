import { MagickNodeType } from '@magickml/client-types'
import { Button, Input } from '@magickml/client-ui'
import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  OnResize,
  Position,
  getNodesBounds,
  useReactFlow,
} from '@xyflow/react'
import React, { useState } from 'react'

const hexToRgba = (hex: string, alpha = 1) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!result) return { r: 0, g: 0, b: 0, a: 1 }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: alpha,
  }
}

const rgbaToString = ({
  r,
  g,
  b,
  a,
}: {
  r: number
  g: number
  b: number
  a: number
}) => `rgba(${r}, ${g}, ${b}, ${a})`

function GroupNodeComponentRaw({
  id,
  data,
  width: _width,
  height: _height,
}: NodeProps<MagickNodeType>) {
  const reactFlowInstance = useReactFlow()
  const { getNodes, setNodes, deleteElements, getNode } = reactFlowInstance
  const [, setWidth] = useState(_width || 10)
  const [, setHeight] = useState(_height || 10)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(data.title || 'group')

  // const store = useStoreApi();
  const nodes = getNodes()

  const onDeleteGroup = () => {
    deleteElements({ nodes: [{ id }] })
  }

  const handleUngroup = () => {
    const parentNode = getNode(id) // Get the parent group node
    if (!parentNode || parentNode.type !== 'group') return

    const childNodes = nodes.filter(node => node.parentId === id)
    const newNodes = nodes.filter(
      node => node.parentId !== id && node.id !== id
    )

    const updatedNodes = childNodes.map(node => ({
      ...node,
      parentId: undefined,
      position: {
        x: node.position.x + parentNode.position.x, // Adjust x position
        y: node.position.y + parentNode.position.y, // Adjust y position
      },
    }))

    setNodes([...newNodes, ...updatedNodes])
  }

  const onResize: OnResize = (event, params) => {
    setWidth(params.width)
    setHeight(params.height)
  }

  const updateNodeColor = (id: string, color: string) => {
    const node = getNode(id)
    if (!node) return

    setNodes([
      ...nodes.filter(n => n.id !== id),
      {
        ...node,
        data: {
          ...node.data,
          color,
        },
      },
    ])
  }

  const handleTitleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    setNodes(currentNodes =>
      currentNodes.map(node =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                title: title,
              },
            }
          : node
      )
    )
  }

  const handleTitleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      handleTitleBlur()
    }
  }

  const childNodes = nodes.filter(node => node.parentId === id)

  const { width: minWidth, height: minHeight } = getNodesBounds(childNodes)

  const color = data.color || '#4f4f4f' // default to black if no color is provided
  const contentColor = rgbaToString(hexToRgba(color, 0.4)) // 50% opacity
  const headerColor = rgbaToString(hexToRgba(color, 0.7)) // 80% opacity

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: contentColor,
      }}
    >
      <NodeResizer
        minWidth={minWidth}
        minHeight={minHeight}
        onResize={onResize}
      />
      <NodeToolbar
        position={Position.Bottom}
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <Button size="sm" variant="outline" onClick={onDeleteGroup}>
          Delete
        </Button>
        {childNodes.length > 0 && (
          <Button size="sm" variant="outline" onClick={handleUngroup}>
            Ungroup
          </Button>
        )}
        <Input
          type="color"
          defaultValue={data.color}
          onChange={evt => updateNodeColor(id, evt.target.value)}
          className="nodrag w-[100px]"
        />
      </NodeToolbar>
      {/* Titlebar with tailwind */}
      <div
        className="text-white h-8 relative bottom-[30px] w-full border-b-2 border-blue-950 text-lg flex items-center p-2"
        style={{ backgroundColor: headerColor }}
        onDoubleClick={handleTitleDoubleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="w-full h-full bg-transparent text-white px-2"
          />
        ) : (
          <span className="w-full h-full flex items-center">{title}</span>
        )}
      </div>
    </div>
  )
}

export const GroupNodeComponent = React.memo(GroupNodeComponentRaw)

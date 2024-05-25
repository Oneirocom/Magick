'use client'
import { memo, useEffect, useRef, useState } from 'react'
import {
  NodeResizer,
  NodeProps,
  OnResize,
  NodeToolbar,
  Position,
} from '@xyflow/react'
import { useChangeNodeData } from '../hooks'
import { MagickNodeType } from '@magickml/client-types'
import { Button } from '@magickml/client-ui'

const CommentNodeRaw = ({ data, selected, id }: NodeProps<MagickNodeType>) => {
  const [isEditing, setIsEditing] = useState(false)
  const [, setIsSelected] = useState(false)
  const [commentText, setCommentText] = useState(data.text || 'Comment')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const handleNodeChange = useChangeNodeData(id)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [commentText])

  const onResize: OnResize = (event, params) => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${params.height - 20}px`
  }

  const handleClick = () => {
    setIsSelected(true)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setIsSelected(false)
    handleNodeChange('text', textareaRef.current?.value)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value)
  }

  const handleFontSizeChange = (fontSize: string) => {
    handleNodeChange('fontSize', fontSize)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <NodeResizer
        onResize={onResize}
        color="#ff0071"
        isVisible={selected || false}
        minWidth={300}
        minHeight={50}
      />
      <NodeToolbar position={Position.Top} className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFontSizeChange('small')}
        >
          Small
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFontSizeChange('medium')}
        >
          Medium
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFontSizeChange('xxx-large')}
        >
          Large
        </Button>
      </NodeToolbar>
      <div
        style={{
          padding: 10,
          zIndex: 100,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={commentText}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full h-full bg-transparent outline-none resize-none p-2 overflow-hidden border-none nodrag"
            style={{
              fontSize: data.fontSize,
            }}
          />
        ) : (
          <div
            className="w-full"
            style={{ fontSize: data.fontSize || 'medium' }}
          >
            {commentText}
          </div>
        )}
      </div>
    </div>
  )
}

export const CommentNode = memo(CommentNodeRaw)

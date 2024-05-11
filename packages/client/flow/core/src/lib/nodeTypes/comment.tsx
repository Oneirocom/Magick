import { memo, useEffect, useRef, useState } from 'react'
import { NodeResizer, NodeProps, OnResize } from '@xyflow/react'
import { useChangeNodeData } from '../hooks'
import { MagickNodeType } from '@magickml/client-types'

const CommentNodeRaw = ({ data, selected, id }: NodeProps<MagickNodeType>) => {
  const [isEditing, setIsEditing] = useState(false)
  const [commentText, setCommentText] = useState(data.text || 'Comment')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const handleNodeChange = useChangeNodeData(id)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Set to scroll height
    }
  }, [commentText])

  const onResize: OnResize = (event, params) => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${params.height - 20}px`
  }

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    handleNodeChange('text', textareaRef.current?.value)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value)
  }

  return (
    <>
      <NodeResizer
        onResize={onResize}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <div
        style={{ padding: 10, zIndex: 100 }}
        onClick={handleClick}
        onDoubleClick={event => event.stopPropagation()}
      >
        <textarea
          ref={textareaRef}
          value={commentText}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full h-full bg-transparent outline-none resize-none p-2 overflow-hidden border-none"
        />
      </div>
    </>
  )
}

export const CommentNode = memo(CommentNodeRaw)

import { Textarea } from '@magickml/client-ui'
import React, { useRef, useEffect } from 'react'

type Props = {
  placeholder: string
  value: string
  handleKeydown: (event: any) => void
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onBlur?: () => void
}

export function ChatTextArea({
  placeholder,
  handleChange,
  handleKeydown,
  value,
  ...props
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const minHeight = 50 // The minimum height in pixels

  const handleInput = (e?: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const shouldSetHeight = Math.max(
        textareaRef.current.scrollHeight,
        minHeight
      )
      textareaRef.current.style.height = `${shouldSetHeight}px`
    }

    if (e) handleChange(e)
  }

  useEffect(() => {
    if (value.length === 0 && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${minHeight}px`
    }
  }, [value])

  useEffect(() => {
    handleInput() // Initial adjustment
  }, [])

  return (
    <Textarea
      className="min-h-[50px] w-full p-2 pt-4 pl-5 border-0 !rounded-t-none !rounded-b-[5px] border-t-ds-neutral border-opacity-50 border-t  bg-ds-background 
       text-ds-black dark:text-ds-white"
      placeholder={`Message ${placeholder}...`}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeydown}
      rows={1}
      autoFocus
    />
  )
}

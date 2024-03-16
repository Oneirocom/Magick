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
    <textarea
      rows={1}
      ref={textareaRef}
      onKeyDown={handleKeydown}
      value={value}
      onChange={e => handleInput(e)}
      className="min-h-[50px] w-full p-2 pt-4 pl-5 border-0 resize-none focus:outline-none focus:ring-0 rounded-lg rounded-b-none md:rounded-b-lg pr-10 bg-transparent border-[#171b1c] black:border-[#dbe2e8] dark:border-[#171b1c] dark:bg-[#171b1c] dark:text-white/50 dark:placeholder-white/50 placeholder-black/50"
      placeholder={placeholder}
      {...props}
    />
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'

export type Message = {
  sender: string
  content: string
  id?: string
}

export const useMessageHistory = ({
  seraph,
  userScrolled = false,
  setUserScrolled,
}: {
  seraph?: boolean
  userScrolled?: boolean
  setUserScrolled: (userScrolled: boolean) => void
}) => {
  const [history, setHistory] = useState<Message[]>([])
  const scrollbarsRef = useRef<Scrollbars>(null)
  const [autoScroll, setAutoScroll] = useState<boolean>(true)

  const isAtBottom = useCallback(() => {
    if (!scrollbarsRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } =
      scrollbarsRef.current.getValues()
    // Consider "at bottom" if within 1px of the bottom
    console.log(
      scrollHeight,
      scrollTop,
      clientHeight,
      Math.abs(scrollHeight - scrollTop - clientHeight)
    )
    return Math.abs(scrollHeight - scrollTop - clientHeight) <= 1
  }, [scrollbarsRef.current])

  const handleScroll = useCallback(() => {
    const atBottom = isAtBottom()
    if (atBottom) {
      setUserScrolled(false)
    } else {
      setUserScrolled(true)
    }
  }, [isAtBottom, setUserScrolled])

  useEffect(() => {
    if (!scrollbarsRef.current) return
    if (!autoScroll) return
    if (userScrolled) return
    scrollbarsRef.current.scrollToBottom()
  }, [history, autoScroll, userScrolled])

  const printToConsole = (text: string) => {
    if (typeof text !== 'string')
      return console.warn('could not split text, not a string', text)

    const newMessage: Message = {
      sender: seraph ? 'user' : 'agent',
      content: seraph ? text : `Agent: ${text}`,
    }
    setHistory(prevHistory => [...prevHistory, newMessage] as Message[])
  }

  const onClear = () => {
    setHistory([])
    setUserScrolled(false)
  }

  return {
    history,
    scrollbars: scrollbarsRef,
    autoscroll: autoScroll,
    setAutoscroll: setAutoScroll,
    printToConsole,
    setHistory,
    onClear,
    isAtBottom,
    handleScroll,
  }
}

import { useEffect, useRef, useState } from 'react'

export type Message = {
  sender: string
  content: string
}

export const useMessageHistory = <TMessage>() => {
  const [history, setHistory] = useState<TMessage[]>([])
  const scrollbars = useRef<any>()
  const [autoScroll, setAutoScroll] = useState<boolean>(true)

  useEffect(() => {
    if (!scrollbars.current) return
    if (!autoScroll) return
    scrollbars.current.scrollToBottom()
  }, [history, autoScroll])

  const printToConsole = (text: string) => {
    if (typeof text !== 'string')
      return console.warn('could not split text, not a string', text)

    const newMessage: Message = {
      sender: 'agent',
      content: `Agent: ${text}`,
    }
    setHistory(prevHistory => [...prevHistory, newMessage] as TMessage[])
  }

  const onClear = () => {
    setHistory([])
  }

  return {
    history,
    scrollbars,
    autoscroll: autoScroll,
    setAutoscroll: setAutoScroll,
    printToConsole,
    setHistory,
    onClear,
  }
}

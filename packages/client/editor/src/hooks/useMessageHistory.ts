import { useEffect, useRef, useState } from 'react'

export type Message = {
  sender: string
  content: string
}

export const useMessageHistory = ({ seraph }: { seraph?: boolean }) => {
  const [history, setHistory] = useState<Message[]>([])
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
      sender: seraph ? 'user' : 'agent',
      content: seraph ? text : `Agent: ${text}`,
    }
    setHistory(prevHistory => [...prevHistory, newMessage] as Message[])
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

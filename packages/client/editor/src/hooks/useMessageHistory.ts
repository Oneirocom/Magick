import { useEffect, useRef, useState } from 'react'

export type Message = {
  sender: string
  content: string
}

export const useMessageHistory = () => {
  const [history, setHistory] = useState<Message[]>([])
  const scrollbars = useRef<any>()
  const [autoscroll, setAutoscroll] = useState<boolean>(true)

  useEffect(() => {
    if (!scrollbars.current) return
    if (!autoscroll) return
    scrollbars.current.scrollToBottom()
  }, [history, autoscroll])

  const printToConsole = (text: string) => {
    const newMessage: Message = {
      sender: 'agent',
      content: `Agent: ${text}`,
    }
    setHistory(prevHistory => [...prevHistory, newMessage])
  }

  const onClear = () => {
    setHistory([])
  }

  return {
    history,
    scrollbars,
    autoscroll,
    setAutoscroll,
    printToConsole,
    onClear,
  }
}

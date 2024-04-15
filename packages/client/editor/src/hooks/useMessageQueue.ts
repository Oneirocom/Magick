import { useRef, useEffect } from 'react'

export const useMessageQueue = ({ setHistory }) => {
  const messageQueue = useRef<string[]>([])
  const queueTimer = useRef<any>(null)

  const processQueue = () => {
    if (messageQueue.current.length > 0) {
      typeChunk() // Directly call typeChunk to process all messages
    }
  }

  useEffect(() => {
    queueTimer.current = setInterval(processQueue, 100) as unknown as null
    return () => {
      if (queueTimer.current)
        clearInterval(queueTimer.current as unknown as number)
    }
  }, [])

  const streamToConsole = (text: string) => {
    if (!text) return

    messageQueue.current.push(text)
    processQueue()
  }

  const typeChunk = () => {
    // Process all messages in the queue at once
    const messagesToProcess = [...messageQueue.current]
    messageQueue.current = [] // Clear the queue as we're processing all messages

    setHistory(prevHistory => {
      const newHistory = [...prevHistory]
      messagesToProcess.forEach(currentMessage => {
        if (
          newHistory.length === 0 ||
          newHistory[newHistory.length - 1].sender !== 'agent'
        ) {
          newHistory.push({ sender: 'agent', content: currentMessage })
        } else {
          newHistory[newHistory.length - 1].content += currentMessage
        }
      })
      return newHistory
    })
  }

  return { streamToConsole }
}

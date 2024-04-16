import { useRef, useEffect } from 'react'

export const useMessageQueue = ({
  setHistory,
  seraph,
}: {
  setHistory: React.Dispatch<
    React.SetStateAction<{ sender: string; content: string }[]>
  >
  seraph?: boolean
}) => {
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

  const streamToConsole = (event: { type: string; text: string }) => {
    if (!event?.text) return

    if (
      event.type === 'token' &&
      !event.text.includes('<END>') &&
      !event.text.includes('<START>')
    ) {
      messageQueue.current.push(event.text)
      processQueue()
    } else if (event.type === 'message') {
      setHistory(prevHistory => [
        ...prevHistory,
        { sender: 'assistant', content: event.text },
      ])
    }
  }

  const typeChunk = () => {
    // Process all messages in the queue at once
    const messagesToProcess = [...messageQueue.current]
    messageQueue.current = [] // Clear the queue as we're processing all messages

    setHistory(prevHistory => {
      const newHistory = [...prevHistory]
      messagesToProcess.forEach(currentMessage => {
        const lastMessage = newHistory[newHistory.length - 1]
        const sender = seraph ? 'user' : 'agent'

        if (!lastMessage || lastMessage.sender !== sender) {
          newHistory.push({
            sender,
            content: currentMessage,
          })
        } else {
          lastMessage.content += currentMessage
        }
      })
      return newHistory
    })
  }

  return { streamToConsole }
}

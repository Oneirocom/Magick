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

  const streamToConsole = (text: string) => {
    if (text === undefined) return
    if (text === '<END>') return

    messageQueue.current.push(text)
    processQueue()
  }

  const typeChunk = () => {
    // Process all messages in the queue at once
    const messagesToProcess = [...messageQueue.current]
    messageQueue.current = [] // Clear the queue as we're processing all messages

    setHistory(prevHistory => {
      const newHistory = [...prevHistory]
      const sender = seraph ? 'assistant' : 'agent'

      messagesToProcess.forEach(currentMessage => {
        if (currentMessage === '<START>') {
          // If the current message is '<START>', create a new message in the history
          newHistory.push({ sender, content: '' })
        } else {
          const lastMessage = newHistory[newHistory.length - 1]
          if (lastMessage && lastMessage.sender === sender) {
            // Append the current message to the last message if the sender is the same
            lastMessage.content += currentMessage
          } else {
            // Create a new message in the history if the sender is different
            newHistory.push({ sender, content: currentMessage })
          }
        }
      })
      return newHistory
    })
  }

  return { streamToConsole }
}

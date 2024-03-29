import { useRef, useEffect } from 'react'

export const useMessageQueue = () => {
  const messageQueue = useRef<string[]>([])
  const queueTimer = useRef<any>(null)

  const processQueue = () => {
    if (messageQueue.current.length > 0) {
      const messagesToProcess = [...messageQueue.current]
      messageQueue.current = []
      return messagesToProcess
    }
    return []
  }

  useEffect(() => {
    queueTimer.current = setInterval(processQueue, 100) as unknown as null
    return () => {
      if (queueTimer.current)
        clearInterval(queueTimer.current as unknown as number)
    }
  }, [])

  const streamToConsole = (text: string) => {
    if (typeof text !== 'string') {
      console.warn('Could not stream text, not a string', text)
      return
    }

    messageQueue.current.push(text)
    processQueue()
  }

  return { processQueue, streamToConsole }
}

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const useEditorSession = () => {
  const [editorSession, setEditorSession] = useState<string | null>(null)

  useEffect(() => {
    const storedEditorSession = sessionStorage.getItem('editorSession')

    if (storedEditorSession) {
      setEditorSession(storedEditorSession)
    } else {
      const newEditorSession = uuidv4()
      sessionStorage.setItem('editorSession', newEditorSession)
      setEditorSession(newEditorSession)
    }
  }, [])

  return editorSession
}

export default useEditorSession

import axios from 'axios'
import { useEffect, useState } from 'react'
import MessageReaction from './MessageReaction'

const MessageReactionEditor = () => {
  const [message_reactions, setMessageReactions] = useState(null)

  const getMessageReactions = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/message_reactions`
    )
    setMessageReactions(res.data)
  }

  const createNew = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_ROOT_URL}/message_reactions`,
        {
          client: '',
          channelId: '',
          message: '',
        }
      )
      await getMessageReactions()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    ;(async () => {
      await getMessageReactions()
    })()
  }, [])

  return (
    <div className="agent-editor">
      {message_reactions &&
        (message_reactions as any).map((message_reaction: any, idx) => (
          <MessageReaction
            key={idx}
            message_reaction={message_reaction}
            updateCallback={() => getMessageReactions()}
          />
        ))}
      <div className="entBtns">
        <button onClick={createNew}>Create New</button>
      </div>
    </div>
  )
}

export default MessageReactionEditor

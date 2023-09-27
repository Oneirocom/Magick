import { Conversation } from '../../types'

export const updateConversation = (
  updatedConversation: Conversation,
  allConversations: Conversation[]
) => {
  const updatedConversations = allConversations.map(c => {
    if (c.id === updatedConversation.id) {
      return updatedConversation
    }

    return c
  })

  saveConversation(updatedConversation)
  saveConversations(updatedConversations)

  return {
    single: updatedConversation,
    all: updatedConversations,
  }
}

export const saveConversation = (conversation: Conversation) => {
  localStorage.setItem('selectedConversation', JSON.stringify(conversation))
}

export const saveConversations = (conversations: Conversation[]) => {
  console.log(
    '🚀 ~ file: conversation.ts:26 ~ saveConversations ~ conversations:',
    conversations
  )
  // TODO: Create spell to save conversation history and "consume" it on chat window
  localStorage.setItem('conversationHistory', JSON.stringify(conversations))
}

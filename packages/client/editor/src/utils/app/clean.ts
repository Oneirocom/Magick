import { Conversation } from '../../types'

export const cleanSelectedConversation = (conversation: Conversation) => {
  let updatedConversation = conversation

  // check for spell on each conversation
  if (!updatedConversation.spell) {
    updatedConversation = {
      ...updatedConversation,
      spell: null,
    }
  }

  // check for system prompt on each conversation
  if (!updatedConversation.prompt) {
    updatedConversation = {
      ...updatedConversation,
    }
  }

  return updatedConversation
}

export const cleanConversationHistory = (history: Conversation[]) => {
  let updatedHistory = [...history]

  // check for spell on each conversation
  if (!updatedHistory.every(conversation => conversation.spell)) {
    updatedHistory = updatedHistory.map(conversation => ({
      ...conversation,
      spell: null,
    }))
  }

  // check for system prompt on each conversation
  if (!updatedHistory.every(conversation => conversation.prompt)) {
    updatedHistory = updatedHistory.map(conversation => ({
      ...conversation,
    }))
  }

  return updatedHistory
}

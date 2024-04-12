// conversation_manager.ts

/**
 * The ConversationManager class manages conversation context.
 */
export type Message = {
  role: 'user' | 'assistant'
  content: string
}

class ConversationManager {
  private conversations: Record<string, Message[]> = {}

  /**
   * Updates the context of a conversation.
   * @param conversationId The identifier of the conversation.
   * @param message The message to add to the context.
   */
  public updateContext(
    conversationId: string,
    _message: string,
    role: 'user' | 'assistant'
  ): void {
    const message = {
      role,
      content: _message,
    }

    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = []
    }

    // Check if the message already exists in the array
    const existingMessage = this.conversations[conversationId].find(
      m => m.role === message.role && m.content === message.content
    )

    if (!existingMessage) {
      this.conversations[conversationId].push(message)
    }
  }

  public removeLastMessage(conversationId: string): void {
    this.conversations[conversationId].pop()
  }

  /**
   * Retrieves the context of a conversation.
   * @param conversationId The identifier of the conversation.
   * @returns The context of the conversation.
   */
  public getMessages(conversationId: string): Message[] {
    return this.conversations[conversationId] || []
  }
}

export { ConversationManager }

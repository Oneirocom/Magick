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
    this.conversations[conversationId].push(message)
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

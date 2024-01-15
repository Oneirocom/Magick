export type TelegramEventType =
  | 'message'
  | 'edited_message'
  | 'channel_post'
  | 'edited_channel_post'
  | 'inline_query'
  | 'chosen_inline_result'
  | 'callback_query'
  | 'shipping_query'
  | 'pre_checkout_query'
  | 'poll'
  | 'poll_answer'
  | 'my_chat_member'
  | 'chat_member'
  | 'new_chat_title'
  | 'new_chat_photo'
  | 'delete_chat_photo'
  | 'group_chat_created'
  | 'supergroup_chat_created'
  | 'channel_chat_created'
  | 'migrate_to_chat_id'
  | 'migrate_from_chat_id'
  | 'pinned_message'
  | 'invoice'
  | 'successful_payment'
  | 'connect_widget'
  | 'passport_data'
  | 'game'
  | 'video_chat_scheduled'
  | 'video_chat_started'
  | 'video_chat_ended'
  | 'video_chat_participants_invited'
  | 'web_app_data'
  | 'proximity_alert_triggered';

  export type TelegramUser = {
    id: number
    is_bot: boolean
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    can_join_groups?: boolean
    can_read_all_group_messages?: boolean
    supports_inline_queries?: boolean
  }
  

  export type TelegramMessageEvent = {
    message_id: number
    from: TelegramUser
    chat: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
      type: string
      title?: string
      all_members_are_administrators?: boolean
    }
    date: number
    text: string
    entities?: {
      offset: number
      length: number
      type: string
    }[]
    caption_entities?: {
      offset: number
      length: number
      type: string
    }[]
    photo?: TelegramPhotoSize[]
    document?: TelegramDocument
    new_chat_members?: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }[]
    left_chat_member?: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
    new_chat_title?: string
    delete_chat_photo?: boolean
    group_chat_created?: boolean
    supergroup_chat_created?: boolean
    channel_chat_created?: boolean
    migrate_to_chat_id?: number
    migrate_from_chat_id?: number
    pinned_message?: TelegramMessageEvent
  }


  export type TelegramInlineQuery = {
    id: string
    from: TelegramUser
    query: string
    offset: string
  }
  
  export type TelegramChosenInlineResult = {
    result_id: string
    from: TelegramUser
    query: string
    inline_message_id?: string
    chat_instance: string
    data?: string
    game_short_name?: string
  }
  
  export type TelegramCallbackQuery = {
    id: string
    from: TelegramUser
    message?: TelegramMessageEvent
    inline_message_id?: string
    chat_instance: string
    data?: string
    game_short_name?: string
  }
  
  

  
  export type TelegramPoll = {
    id: string
    question: string
    options: string[]
    is_closed: boolean
  }
  
  export type TelegramPollAnswer = {
    poll_id: string
    user: TelegramUser
    option_ids: number[]
  }
  

  export type TelegramEventPayload = {
    update_id: number
    message: TelegramMessageEvent
    edited_message?: TelegramMessageEvent
    channel_post?: TelegramMessageEvent
    edited_channel_post?: TelegramMessageEvent
    inline_query?: TelegramInlineQuery
    chosen_inline_result?: TelegramChosenInlineResult
    callback_query?: TelegramCallbackQuery
    poll?: TelegramPoll
    poll_answer?: TelegramPollAnswer
  }
  
  
  export type TelegramPhotoSize = {
    file_id: string
    file_unique_id: string
    file_size: number
    width: number
    height: number
  };
  
  export type TelegramDocument = {
    file_id: string;
    file_name?: string;
    file_size?: number;
    // Add more document properties as needed
  };
  
  export type TelegramCredentials = {
    botToken: string | undefined;
  };
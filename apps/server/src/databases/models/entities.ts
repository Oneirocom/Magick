import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface entitiesAttributes {
  id?: number
  instanceId?: number
  personality?: string
  enabled?: boolean
  updated_at?: string
  dirty?: boolean
  discord_enabled?: boolean
  discord_api_key?: string
  discord_starting_words?: string
  discord_bot_name_regex?: string
  discord_bot_name?: string
  discord_empty_responses?: string
  discord_greeting_id?: string
  discord_echo_slack?: boolean
  discord_echo_format?: string
  discord_spell_handler_incoming?: string
  discord_spell_handler_update?: string
  discord_spell_handler_metadata?: string
  discord_spell_handler_slash_command?: string
  use_voice?: boolean
  voice_provider?: string
  voice_character?: string
  voice_language_code?: string
  voice_default_phrases?: string
  use_custom_commands?: boolean
  custom_command_starter?: string
  custom_commands?: string
  tiktalknet_url?: string
  xrengine_enabled?: boolean
  xrengine_url?: string
  xrengine_spell_handler_incoming?: string
  xrengine_spell_handler_update?: string
  xrengine_spell_handler_feed?: string
  xrengine_bot_name?: string
  xrengine_bot_name_regex?: string
  xrengine_starting_words?: string
  xrengine_empty_responses?: string
  twitter_client_enable?: boolean
  twitter_token?: string
  twitter_id?: string
  twitter_app_token?: string
  twitter_app_token_secret?: string
  twitter_access_token?: string
  twitter_access_token_secret?: string
  twitter_enable_twits?: boolean
  twitter_tweet_rules?: string
  twitter_auto_tweet_interval_min?: string
  twitter_auto_tweet_interval_max?: string
  twitter_bot_name?: string
  twitter_bot_name_regex?: string
  twitter_spell_handler_incoming?: string
  twitter_spell_handler_auto?: string
  telegram_enabled?: boolean
  telegram_bot_token?: string
  telegram_bot_name?: string
  telegram_spell_handler_incoming?: string
  reddit_enabled?: boolean
  reddit_app_id?: string
  reddit_app_secret_id?: string
  reddit_oauth_token?: string
  reddit_bot_name?: string
  reddit_bot_name_regex?: string
  reddit_spell_handler_incoming?: string
  zoom_enabled?: boolean
  zoom_invitation_link?: string
  zoom_password?: string
  zoom_bot_name?: string
  zoom_spell_handler_incoming?: string
  loop_enabled?: boolean
  loop_interval?: string
  loop_agent_name?: string
  loop_spell_handler?: string
  slack_enabled?: boolean
  slack_token?: string
  slack_signing_secret?: string
  slack_bot_token?: string
  slack_bot_name?: string
  slack_port?: string
  slack_echo_channel?: string
  slack_spell_handler_incoming?: string
  instagram_enabled?: boolean
  instagram_username?: string
  instagram_password?: string
  instagram_bot_name?: string
  instagram_bot_name_regex?: string
  instagram_spell_handler_incoming?: string
  messenger_enabled?: boolean
  messenger_page_access_token?: string
  messenger_verify_token?: string
  messenger_bot_name?: string
  messenger_bot_name_regex?: string
  messenger_spell_handler_incoming?: string
  twilio_enabled?: boolean
  twilio_account_sid?: string
  twilio_auth_token?: string
  twilio_phone_number?: string
  twilio_bot_name?: string
  twilio_empty_responses?: string
  twilio_spell_handler_incoming?: string
}

export type entitiesPk = 'id'
export type entitiesId = entities[entitiesPk]
export type entitiesOptionalAttributes =
  | 'discord_enabled'
  | 'discord_api_key'
  | 'discord_starting_words'
  | 'discord_bot_name_regex'
  | 'discord_bot_name'
  | 'discord_empty_responses'
  | 'discord_greeting_id'
  | 'discord_echo_slack'
  | 'discord_echo_format'
  | 'discord_spell_handler_incoming'
  | 'discord_spell_handler_update'
  | 'discord_spell_handler_metadata'
  | 'discord_spell_handler_slash_command'
  | 'use_voice'
  | 'voice_provider'
  | 'voice_character'
  | 'voice_language_code'
  | 'voice_default_phrases'
  | 'use_custom_commands'
  | 'custom_command_starter'
  | 'custom_commands'
  | 'tiktalknet_url'
  | 'xrengine_enabled'
  | 'xrengine_url'
  | 'xrengine_spell_handler_incoming'
  | 'xrengine_spell_handler_update'
  | 'xrengine_spell_handler_feed'
  | 'xrengine_bot_name'
  | 'xrengine_bot_name_regex'
  | 'twitter_client_enable'
  | 'twitter_token'
  | 'twitter_id'
  | 'twitter_app_token'
  | 'twitter_app_token_secret'
  | 'twitter_access_token'
  | 'twitter_access_token_secret'
  | 'twitter_enable_twits'
  | 'twitter_tweet_rules'
  | 'twitter_auto_tweet_interval_min'
  | 'twitter_auto_tweet_interval_max'
  | 'twitter_bot_name'
  | 'twitter_bot_name_regex'
  | 'twitter_spell_handler_incoming'
  | 'twitter_spell_handler_auto'
  | 'telegram_enabled'
  | 'telegram_bot_token'
  | 'telegram_bot_name'
  | 'telegram_spell_handler_incoming'
  | 'reddit_enabled'
  | 'reddit_app_id'
  | 'reddit_app_secret_id'
  | 'reddit_oauth_token'
  | 'reddit_bot_name'
  | 'reddit_bot_name_regex'
  | 'reddit_spell_handler_incoming'
  | 'zoom_enabled'
  | 'zoom_invitation_link'
  | 'zoom_password'
  | 'zoom_bot_name'
  | 'zoom_spell_handler_incoming'
  | 'loop_enabled'
  | 'loop_interval'
  | 'loop_agent_name'
  | 'loop_spell_handler'
  | 'slack_enabled'
  | 'slack_token'
  | 'slack_signing_secret'
  | 'slack_bot_token'
  | 'slack_bot_name'
  | 'slack_port'
  | 'slack_echo_channel'
  | 'slack_spell_handler_incoming'
  | 'instagram_enabled'
  | 'instagram_username'
  | 'instagram_password'
  | 'instagram_bot_name'
  | 'instagram_bot_name_regex'
  | 'instagram_spell_handler_incoming'
  | 'messenger_enabled'
  | 'messenger_page_access_token'
  | 'messenger_verify_token'
  | 'messenger_bot_name'
  | 'messenger_bot_name_regex'
  | 'messenger_spell_handler_incoming'
  | 'twilio_enabled'
  | 'twilio_account_sid'
  | 'twilio_auth_token'
  | 'twilio_phone_number'
  | 'twilio_bot_name'
  | 'twilio_empty_responses'
  | 'twilio_spell_handler_incoming'
  | 'enabled'
  | 'updated_at'
export type entitiesCreationAttributes = Optional<
  entitiesAttributes,
  entitiesOptionalAttributes
>

export class entities
  extends Model<entitiesAttributes, entitiesCreationAttributes>
  implements entitiesAttributes {
  id?: number
  instanceId?: number
  personality?: string
  enabled?: boolean
  updated_at?: string
  discord_enabled?: boolean
  discord_api_key?: string
  discord_starting_words?: string
  discord_bot_name_regex?: string
  discord_bot_name?: string
  discord_empty_responses?: string
  discord_greeting_id?: string
  discord_echo_slack?: boolean
  discord_echo_format?: string
  discord_spell_handler_incoming?: string
  discord_spell_handler_update?: string
  discord_spell_handler_metadata?: string
  discord_spell_handler_slash_command?: string
  use_voice?: boolean
  voice_provider?: string
  voice_character?: string
  voice_language_code?: string
  voice_default_phrases?: string
  use_custom_commands?: boolean
  custom_command_starter?: string
  custom_commands?: string
  tiktalknet_url?: string
  xrengine_enabled?: boolean
  xrengine_url?: string
  xrengine_spell_handler_incoming?: string
  xrengine_spell_handler_update?: string
  xrengine_spell_handler_feed?: string
  xrengine_bot_name?: string
  xrengine_bot_name_regex?: string
  xrengine_starting_words?: string
  xrengine_empty_responses?: string
  twitter_client_enable?: boolean
  twitter_token?: string
  twitter_id?: string
  twitter_app_token?: string
  twitter_app_token_secret?: string
  twitter_access_token?: string
  twitter_access_token_secret?: string
  twitter_enable_twits?: boolean
  twitter_tweet_rules?: string
  twitter_auto_tweet_interval_min?: string
  twitter_auto_tweet_interval_max?: string
  twitter_bot_name?: string
  twitter_bot_name_regex?: string
  twitter_spell_handler_incoming?: string
  twitter_spell_handler_auto?: string
  telegram_enabled?: boolean
  telegram_bot_token?: string
  telegram_bot_name?: string
  telegram_spell_handler_incoming?: string
  reddit_enabled?: boolean
  reddit_app_id?: string
  reddit_app_secret_id?: string
  reddit_oauth_token?: string
  reddit_bot_name?: string
  reddit_bot_name_regex?: string
  reddit_spell_handler_incoming?: string
  zoom_enabled?: boolean
  zoom_invitation_link?: string
  zoom_password?: string
  zoom_bot_name?: string
  zoom_spell_handler_incoming?: string
  loop_enabled?: boolean
  loop_interval?: string
  loop_agent_name?: string
  loop_spell_handler?: string
  slack_enabled?: boolean
  slack_token?: string
  slack_signing_secret?: string
  slack_bot_token?: string
  slack_bot_name?: string
  slack_port?: string
  slack_echo_channel?: string
  slack_spell_handler_incoming?: string
  instagram_enabled?: boolean
  instagram_username?: string
  instagram_password?: string
  instagram_bot_name?: string
  instagram_bot_name_regex?: string
  instagram_spell_handler_incoming?: string
  messenger_enabled?: boolean
  messenger_page_access_token?: string
  messenger_verify_token?: string
  messenger_bot_name?: string
  messenger_bot_name_regex?: string
  messenger_spell_handler_incoming?: string
  twilio_enabled?: boolean
  twilio_account_sid?: string
  twilio_auth_token?: string
  twilio_phone_number?: string
  twilio_bot_name?: string
  twilio_empty_responses?: string
  twilio_spell_handler_incoming?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof entities {
    return entities.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        dirty: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        personality: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        discord_api_key: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_starting_words: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_empty_responses: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_greeting_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'greetings',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        discord_echo_slack: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        discord_echo_format: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        use_voice: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        voice_provider: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        voice_character: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        voice_language_code: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        voice_default_phrases: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        use_custom_commands: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        custom_command_starter: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        custom_commands: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        tiktalknet_url: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_spell_handler_update: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_spell_handler_metadata: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discord_spell_handler_slash_command: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        xrengine_url: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_spell_handler_update: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_spell_handler_feed: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_starting_words: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        xrengine_empty_responses: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_client_enable: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        twitter_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_id: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_app_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_app_token_secret: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_access_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_access_token_secret: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_enable_twits: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_tweet_rules: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_auto_tweet_interval_min: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_auto_tweet_interval_max: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twitter_spell_handler_auto: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        telegram_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        telegram_bot_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        telegram_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        telegram_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        reddit_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        reddit_app_id: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        reddit_app_secret_id: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        reddit_oauth_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        reddit_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        reddit_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        reddit_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        zoom_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        zoom_invitation_link: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        zoom_password: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        zoom_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        zoom_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        loop_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        loop_interval: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        loop_agent_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        loop_spell_handler: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        slack_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        slack_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        slack_signing_secret: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        slack_bot_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        slack_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        slack_port: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        slack_echo_channel: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        slack_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        instagram_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        instagram_username: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        instagram_password: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        instagram_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        instagram_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        instagram_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        messenger_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        messenger_page_access_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        messenger_verify_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        messenger_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        messenger_bot_name_regex: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        messenger_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twilio_enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        twilio_account_sid: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twilio_auth_token: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twilio_phone_number: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twilio_bot_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twilio_empty_responses: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        twilio_spell_handler_incoming: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'entities',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}

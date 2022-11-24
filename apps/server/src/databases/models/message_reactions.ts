import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface messageReactionsAttributes {
  reaction?: string
  spell_handler?: string
  discord_enabled?: string
  slack_enabled?: string
}

export type messageReactionsOptionalAttributes =
  | 'reaction'
  | 'spell_handler'
  | 'discord_enabled'
  | 'slack_enabled'
export type messageReactionCreationAttributes = Optional<
  messageReactionsAttributes,
  messageReactionsOptionalAttributes
>

export class message_reactions
  extends Model<messageReactionsAttributes, messageReactionCreationAttributes>
  implements messageReactionsAttributes
{
  reaction?: string
  spell_handler?: string
  discord_enabled?: string
  slack_enabled?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof message_reactions {
    return message_reactions.init(
      {
        reaction: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        spell_handler: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        discord_enabled: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        slack_enabled: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'message_reactions',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}

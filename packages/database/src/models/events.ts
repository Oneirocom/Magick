import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface eventsAttributes {
  type?: string;
  agent?: string;
  client?: string;
  channel?: string;
  sender?: string;
  text?: string;
  date?: string;
}

export type eventsOptionalAttributes = "agent" | "client" | "channel" | "sender" | "text" | "date";
export type eventsCreationAttributes = Optional<eventsAttributes, eventsOptionalAttributes>;

export class events extends Model<eventsAttributes, eventsCreationAttributes> implements eventsAttributes {
  agent?: string;
  client?: string;
  channel?: string;
  sender?: string;
  text?: string;
  date?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof events {
    return events.init({
      type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      client: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      channel: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      sender: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      date: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'events',
      schema: 'public',
      timestamps: false
    });
  }
}

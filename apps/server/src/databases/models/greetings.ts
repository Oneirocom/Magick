import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface greetingsAttributes {
  enabled?: boolean;
  channelId?: string;
  message?: string;
  sendIn?: string;
}

export type greetingsOptionalAttributes = "channelId" | "message";
export type greetingsCreationAttributes = Optional<greetingsAttributes, greetingsOptionalAttributes>;

export class greetings extends Model<greetingsAttributes, greetingsCreationAttributes> implements greetingsAttributes {
  channelId?: string;
  message?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof greetings {
    return greetings.init({
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      channelId: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      sendIn: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    }, {
      sequelize,
      tableName: 'greetings',
      schema: 'public',
      timestamps: false
    });
  }
}

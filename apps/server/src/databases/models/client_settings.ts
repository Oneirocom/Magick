import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface clientSettingAttributes {
  id: number
  client: string
  name: string
  type: string
  defaultValue?: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: Boolean
}

export type clientSettingOptionalAttributes =
  | 'createdAt'
  | 'updatedAt'
  | 'isDeleted'
  | 'defaultValue'

export type clientSettingCreationAttributes = Optional<
  clientSettingAttributes,
  clientSettingOptionalAttributes
>

export class clientSettings
  extends Model<clientSettingAttributes, clientSettingCreationAttributes>
  implements clientSettingAttributes
{
  id: number
  client: string
  name: string
  type: string
  defaultValue?: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: Boolean

  static initModel(sequelize: Sequelize.Sequelize): typeof clientSettings {
    return clientSettings.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        client: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: true,
          },
          field: 'client',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: true,
          },
          field: 'name',
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: true,
          },
          field: 'type',
        },
        defaultValue: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: false,
          },
          field: 'default_value',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn('now'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn('now'),
          field: 'updated_at',
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: 'is_deleted',
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'client_settings',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}

import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface configurationSettingAttributes {
  id: number
  key: string
  value: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: Boolean
}

export type configurationSettingOptionalAttributes =
  | 'createdAt'
  | 'updatedAt'
  | 'isDeleted'

export type configurationSettingCreationAttributes = Optional<
  configurationSettingAttributes,
  configurationSettingOptionalAttributes
>

export class configurationSettings
  extends Model<
    configurationSettingAttributes,
    configurationSettingCreationAttributes
  >
  implements configurationSettingAttributes
{
  id: number
  key: string
  value: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: Boolean

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof configurationSettings {
    return configurationSettings.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        key: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: true,
          },
          field: 'key',
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: true,
          },
          field: 'value',
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
        tableName: 'configuration_settings',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}

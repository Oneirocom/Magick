import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface scopeSettingAttributes {
  id: number
  tables: string
  fullTableSize?: string
  tableSize?: string
  recordCount?: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: Boolean
}

export type scopeSettingOptionalAttributes =
  | 'createdAt'
  | 'updatedAt'
  | 'isDeleted'
  | 'recordCount'

export type scopeSettingCreationAttributes = Optional<
  scopeSettingAttributes,
  scopeSettingOptionalAttributes
>

export class scopeSettings
  extends Model<scopeSettingAttributes, scopeSettingCreationAttributes>
  implements scopeSettingAttributes
{
  id: number
  tables: string
  fullTableSize?: string
  tableSize?: string
  recordCount?: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: Boolean

  static initModel(sequelize: Sequelize.Sequelize): typeof scopeSettings {
    return scopeSettings.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        tables: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: true,
          },
          field: 'tables',
        },
        fullTableSize: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: true,
          },
          defaultValue: '0 Bytes',
          field: 'full_table_size',
        },
        tableSize: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: true,
          },
          defaultValue: '0 Bytes',
          field: 'table_size',
        },
        recordCount: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: false,
          unique: false,
          validate: {
            notEmpty: false,
          },
          defaultValue: '0',
          field: 'record_count',
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
        tableName: 'scope_settings',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}

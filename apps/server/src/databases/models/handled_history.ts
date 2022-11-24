import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface handled_historyAttributes {
  id: number
  _id?: string
  client?: string
  data?: string
  createdAt?: Date
  updatedAt?: Date
}

export type handled_historyAttributesAttributes =
  | '_id'
  | 'client'
  | 'data'
  | 'createdAt'
  | 'updatedAt'

export type clientSettingCreationAttributes = Optional<
  handled_historyAttributes,
  handled_historyAttributesAttributes
>

export class handled_history
  extends Model<handled_historyAttributes, clientSettingCreationAttributes>
  implements handled_historyAttributes
{
  id: number
  _id?: string
  client?: string
  data?: string
  createdAt?: Date
  updatedAt?: Date

  static initModel(sequelize: Sequelize.Sequelize): typeof handled_history {
    return handled_history.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        _id: {
          type: DataTypes.STRING,
          allowNull: true,
          field: '_id',
          primaryKey: false,
        },
        client: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'client',
        },
        data: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'data',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn('now'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn('now'),
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'handled_history',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}

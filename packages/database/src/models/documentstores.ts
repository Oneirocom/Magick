import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface documentsStoreAttributes {
  id: number
  name: string
}

export type documentsStoreOptionalAttributes = 'name'
export type documentsStoreCreationAttributes = Optional<documentsStoreAttributes, documentsStoreOptionalAttributes>

export class documentsStore 
  extends Model<documentsStoreAttributes, documentsStoreCreationAttributes>
  implements documentsStoreAttributes
{
  id: number
  name: string

  static initModel(sequelize: Sequelize.Sequelize): typeof documentsStore {
    return documentsStore.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
        }
      },
      {
        sequelize,
        tableName: 'documents_store',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}
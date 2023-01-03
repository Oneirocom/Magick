import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface contentObjAttributes {
  id: number
  title: string
  description: string
  is_included: boolean
  documentId: number
}

export type contentObjOptionalAttributes = 'description'
export type contentObjCreationAttributes = Optional<
  contentObjAttributes,
  contentObjOptionalAttributes
>

export class contentObj
  extends Model<contentObjAttributes, contentObjCreationAttributes>
  implements contentObjAttributes
{
  id: number
  title: string
  description: string
  is_included: boolean
  documentId: number
  
  static initModel(sequelize: Sequelize.Sequelize): typeof contentObj {
    return contentObj.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        is_included: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        documentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'documents',
            key: 'id'
          },
          field: 'document_id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      {
        sequelize,
        tableName: 'content_objects',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}

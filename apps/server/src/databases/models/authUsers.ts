import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface authUsersAttributes {
  id: number
  userId: string
  token?: string
  email?: string
  username?: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: Boolean
}

export type authUsersAttributesOptionalAttributes =
  | 'email'
  | 'username'
  | 'password'
  | 'isDeleted'
  | 'createdAt'
  | 'updatedAt'

export type authUsersAttributesCreationAttributes = Optional<
  authUsersAttributes,
  authUsersAttributesOptionalAttributes
>

export class authUsers
  extends Model<authUsersAttributes, authUsersAttributes>
  implements authUsersAttributes
{
  id: number
  userId: string
  token?: string
  email?: string
  username?: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: Boolean

  static initModel(sequelize: Sequelize.Sequelize): typeof authUsers {
    return authUsers.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'user_id',
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'token',
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
        email: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'email',
          defaultValue: null,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'username',
          defaultValue: null,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'password',
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: 'auth_users',
        schema: 'public',
        timestamps: false,
      }
    )
  }
}

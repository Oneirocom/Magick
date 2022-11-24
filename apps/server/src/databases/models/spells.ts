import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface spellsAttributes {
  id: string;
  name: string;
  graph?: object;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId?: string;
  modules?: object;
  gameState?: object;
}

export type spellsPk = "id";
export type spellsId = spells[spellsPk];
export type spellsOptionalAttributes = "id" | "graph" | "createdAt" | "updatedAt" | "deletedAt" | "modules" | "gameState";
export type spellsCreationAttributes = Optional<spellsAttributes, spellsOptionalAttributes>;

export class spells extends Model<spellsAttributes, spellsCreationAttributes> implements spellsAttributes {
  id!: string;
  name!: string;
  graph?: object;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId?: string;
  modules?: object;
  gameState?: object;


  static initModel(sequelize: Sequelize.Sequelize): typeof spells {
    spells.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: "spells_name_key"
      },
      graph: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.fn('now'),
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.fn('now'),
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at'
      },
      userId: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_id'
      },
      modules: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      gameState: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'game_state'
      }
    }, {
      sequelize,
      tableName: 'spells',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: "spells_name_key",
          unique: true,
          fields: [
            { name: "name" },
          ]
        },
        {
          name: "spells_pkey",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
      ]
    });
    return spells;
  }
}
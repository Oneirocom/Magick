import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface deployedSpellsAttributes {
  id: string;
  name: string;
  graph?: object;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId: string;
  version: number;
  message?: string;
  modules?: object;
  versionName?: string;
}

export type deployedSpellsPk = "id";
export type deployedSpellsId = deployedSpells[deployedSpellsPk];
export type deployedSpellsOptionalAttributes = "id" | "graph" | "createdAt" | "updatedAt" | "deletedAt" | "version" | "message" | "modules" | "versionName";
export type deployedSpellsCreationAttributes = Optional<deployedSpellsAttributes, deployedSpellsOptionalAttributes>;

export class deployedSpells extends Model<deployedSpellsAttributes, deployedSpellsCreationAttributes> implements deployedSpellsAttributes {
  id!: string;
  name!: string;
  graph?: object;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId!: string;
  version!: number;
  message?: string;
  modules?: object;
  versionName?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof deployedSpells {
    deployedSpells.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
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
        allowNull: false,
        field: 'user_id'
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      modules: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      versionName: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'version_name'
      }
    }, {
      sequelize,
      tableName: 'deployed_spells',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: "deployed_spells_pkey",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
      ]
    });
    return deployedSpells;
  }
}

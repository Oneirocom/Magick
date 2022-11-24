import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface wikipediaAttributes {
  agent?: string;
  _data?: string;
}

export type wikipediaOptionalAttributes = "agent" | "_data";
export type wikipediaCreationAttributes = Optional<wikipediaAttributes, wikipediaOptionalAttributes>;

export class wikipedia extends Model<wikipediaAttributes, wikipediaCreationAttributes> implements wikipediaAttributes {
  agent?: string;
  _data?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof wikipedia {
    return wikipedia.init({
    agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    _data: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'wikipedia',
    schema: 'public',
    timestamps: false
  });
  }
}

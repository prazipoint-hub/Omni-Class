import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class Subject extends Model {}

Subject.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    schoolId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },

  {
    sequelize,
    modelName: "Subject",
    tableName: "subjects",
    timestamps: true
  }
);

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class Class extends Model {}

Class.init(
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

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    gradeLevel: {
      type: DataTypes.STRING,
      allowNull: false
    },

    stream: {
      type: DataTypes.STRING,
      allowNull: true
    },

    academicYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },

  {
    sequelize,
    modelName: "Class",
    tableName: "classes",
    timestamps: true
  }
);

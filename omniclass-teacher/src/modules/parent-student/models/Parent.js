import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

export default class Parent extends Model {}

Parent.init(
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

    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    relationship: {
      type: DataTypes.ENUM("FATHER", "MOTHER", "GUARDIAN", "OTHER"),
      allowNull: true
    },

    occupation: {
      type: DataTypes.STRING,
      allowNull: true
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE"
    }
  },
  {
    sequelize,
    modelName: "Parent",
    tableName: "parents",
    timestamps: true
  }
);

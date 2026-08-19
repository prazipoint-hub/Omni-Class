import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

export default class ParentStudent extends Model {}

ParentStudent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    parentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    relationship: {
      type: DataTypes.ENUM("FATHER", "MOTHER", "GUARDIAN", "OTHER"),
      allowNull: false
    },

    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    canReceiveNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    canViewFinancialInformation: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: "ParentStudent",
    tableName: "parent_student",
    timestamps: true
  }
);

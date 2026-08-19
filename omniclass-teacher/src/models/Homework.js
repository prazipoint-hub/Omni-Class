import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class Homework extends Model {}

Homework.init(
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

    teachingAssignmentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    assignedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    maxMark: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("draft", "published", "closed"),

      defaultValue: "draft"
    }
  },

  {
    sequelize,
    modelName: "Homework",
    tableName: "homework",
    timestamps: true
  }
);

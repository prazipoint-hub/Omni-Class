import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class Assessment extends Model {}

Assessment.init(
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

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    type: {
      type: DataTypes.ENUM("classwork", "homework", "test", "exam", "project", "continuous_assessment"),

      allowNull: false
    },

    term: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    maxMark: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },

    weight: {
      type: DataTypes.DECIMAL(6, 3),
      allowNull: false,
      defaultValue: 1
    },

    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("draft", "open", "submitted", "locked"),

      defaultValue: "draft"
    }
  },

  {
    sequelize,
    modelName: "Assessment",
    tableName: "assessments",
    timestamps: true
  }
);

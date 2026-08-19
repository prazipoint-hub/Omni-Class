import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class SchemeOfWork extends Model {}

SchemeOfWork.init(
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

    term: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    week: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    topic: {
      type: DataTypes.STRING,
      allowNull: false
    },

    objectives: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    activities: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    resources: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("planned", "in_progress", "completed"),

      defaultValue: "planned"
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },

  {
    sequelize,
    modelName: "SchemeOfWork",
    tableName: "schemes_of_work",
    timestamps: true
  }
);

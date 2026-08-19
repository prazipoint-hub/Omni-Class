import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class LessonPlan extends Model {}

LessonPlan.init(
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

    lessonDate: {
      type: DataTypes.DATEONLY,
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

    reflection: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("draft", "completed"),

      defaultValue: "draft"
    }
  },

  {
    sequelize,
    modelName: "LessonPlan",
    tableName: "lesson_plans",
    timestamps: true
  }
);

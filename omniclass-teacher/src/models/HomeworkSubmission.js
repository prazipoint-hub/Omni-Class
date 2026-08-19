import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class HomeworkSubmission extends Model {}

HomeworkSubmission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    homeworkId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("pending", "submitted", "late", "marked"),

      defaultValue: "pending"
    },

    mark: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },

    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },

  {
    sequelize,
    modelName: "HomeworkSubmission",
    tableName: "homework_submissions",
    timestamps: true
  }
);

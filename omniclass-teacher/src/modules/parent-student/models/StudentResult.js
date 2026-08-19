import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

export default class StudentResult extends Model {}

StudentResult.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    subjectId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    academicYearId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    termId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    assessmentType: {
      type: DataTypes.ENUM("TEST", "ASSIGNMENT", "PROJECT", "EXAM", "FINAL"),
      allowNull: false
    },

    score: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    maximumScore: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    grade: {
      type: DataTypes.STRING,
      allowNull: true
    },

    teacherComment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "StudentResult",
    tableName: "student_results",
    timestamps: true
  }
);

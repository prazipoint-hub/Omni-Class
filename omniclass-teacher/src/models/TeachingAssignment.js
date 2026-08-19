import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class TeachingAssignment extends Model {}

TeachingAssignment.init(
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

    teacherId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    classId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    subjectId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    isClassTeacher: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },

  {
    sequelize,
    modelName: "TeachingAssignment",
    tableName: "teaching_assignments",
    timestamps: true
  }
);

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

export default class StudentAttendance extends Model {}

StudentAttendance.init(
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

    classId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("PRESENT", "ABSENT", "LATE", "EXCUSED"),
      allowNull: false
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    recordedBy: {
      type: DataTypes.UUID,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "StudentAttendance",
    tableName: "student_attendance",
    timestamps: true
  }
);

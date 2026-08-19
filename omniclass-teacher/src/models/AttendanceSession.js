import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class AttendanceSession extends Model {}

AttendanceSession.init(
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
      allowNull: true
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    period: {
      type: DataTypes.STRING,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("draft", "submitted", "locked"),

      defaultValue: "draft"
    }
  },

  {
    sequelize,
    modelName: "AttendanceSession",
    tableName: "attendance_sessions",
    timestamps: true
  }
);

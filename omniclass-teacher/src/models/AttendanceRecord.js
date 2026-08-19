import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class AttendanceRecord extends Model {}

AttendanceRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    attendanceSessionId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("present", "absent", "late", "excused"),

      allowNull: false
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },

  {
    sequelize,
    modelName: "AttendanceRecord",
    tableName: "attendance_records",
    timestamps: true
  }
);

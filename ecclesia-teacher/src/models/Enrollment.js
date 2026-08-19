import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class Enrollment extends Model {}

Enrollment.init(
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

    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    classId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    academicYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    term: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },

  {
    sequelize,
    modelName: "Enrollment",
    tableName: "enrollments",
    timestamps: true
  }
);

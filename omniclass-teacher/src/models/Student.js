import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class Student extends Model {}

Student.init(
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

    admissionNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("active", "inactive", "graduated"),

      defaultValue: "active"
    }
  },

  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: true
  }
);

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class Teacher extends Model {}

Teacher.init(
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

    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },

    employeeNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),

      defaultValue: "active"
    }
  },

  {
    sequelize,
    modelName: "Teacher",
    tableName: "teachers",
    timestamps: true
  }
);

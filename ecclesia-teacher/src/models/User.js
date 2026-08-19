import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class User extends Model {}

User.init(
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

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM("teacher", "admin", "parent", "student"),
      allowNull: false,
      defaultValue: "teacher"
    },

    teacherId: {
      type: DataTypes.UUID,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active"
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true
  }
);

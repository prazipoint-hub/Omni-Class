import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database.js";

export default class Approval extends Model {}

Approval.init(
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

    type: {
      type: DataTypes.ENUM("leave", "purchase", "expense", "transfer", "other"),
      allowNull: false
    },

    referenceId: {
      type: DataTypes.UUID,
      allowNull: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    requestedBy: {
      type: DataTypes.UUID,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("pending", "reviewing", "approved", "rejected"),
      defaultValue: "pending"
    },

    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true
    },

    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    data: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Approval",
    tableName: "approvals",
    timestamps: true
  }
);

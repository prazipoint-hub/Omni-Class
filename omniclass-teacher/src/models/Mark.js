import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export default class Mark extends Model {}

Mark.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    assessmentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    mark: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    enteredBy: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },

  {
    sequelize,
    modelName: "Mark",
    tableName: "marks",
    timestamps: true
  }
);

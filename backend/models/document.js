import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Document = sequelize.define("Document", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  s3Url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "Unknown",
  },
  summary: {
    type: DataTypes.TEXT,
    defaultValue: "No summary available",
  },
});

export default Document;

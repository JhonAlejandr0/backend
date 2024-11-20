import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
class Admin extends Model {}

Admin.init(
  {
    idAdmin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    documentoFK: {
      type: DataTypes.INTEGER,
      references: {
        model: "usuarios",
        key: "documento",
      },
      onDelete: "CASCADE",
    },
    // otros atributos
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "admin",
    timestamps: true,
  }
);

export default Admin;

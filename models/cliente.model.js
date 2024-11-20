import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
class Cliente extends Model {}

Cliente.init(
  {
    idCliente: {
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
  },
  {
    sequelize,
    modelName: "Cliente",
    tableName: "cliente",
    timestamps: true, // Habilita los timestamps
  }
);

export default Cliente;

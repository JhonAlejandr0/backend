import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class DetalleVenta extends Model {}

DetalleVenta.init(
  {
    idDetalleVenta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    valorUnitario: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    idVentasFK: DataTypes.INTEGER,
    idProductosFK: DataTypes.INTEGER,
  },

  {
    sequelize,
    modelName: "DetalleVenta",
    tableName: "detalleventa",
  }
);

export default DetalleVenta;

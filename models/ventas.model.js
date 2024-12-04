import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Venta extends Model {}

Venta.init(
  {
    idVentas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaVenta: DataTypes.DATE,
    metodoPagoVenta: DataTypes.STRING,
    documentoFK: DataTypes.INTEGER,
    estadoVenta: {
      type: DataTypes.ENUM("Pendiente", "En camino", "Completado", "Cancelada"),
      defaultValue: "Pendiente",
    },
    valorTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      Venta,
    },
    idPedidoFK: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Venta",
    tableName: "ventas", // Especifica el nombre de la tabla
  }
);
Venta.associate = function (models) {
  Venta.belongsTo(models.Pedido, {
    foreignKey: "idPedidoFK",
    as: "pedido",
  });
};

export default Venta;

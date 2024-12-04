import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import Domiciliario from "./domiciliario.model.js";
import Cliente from "./cliente.model.js";
import Usuario from "./usuario.model.js";
class Pedido extends Model {}

Pedido.init(
  {
    idPedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaPedido: DataTypes.DATE,
    estadoPedido: {
      type: DataTypes.ENUM("Pendiente", "En camino", "Completado", "Cancelado"),
      defaultValue: "Pendiente",
    },
    documentoFK: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuario,
        key: "documento",
      },
      onDelete: "CASCADE",
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idDomiciliarioFK: {
      type: DataTypes.INTEGER,
      references: {
        model: Domiciliario,
        key: "idDomiciliario",
      },
      onDelete: "SET NULL",
    },

    pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Pedido",
    tableName: "pedidos", // Especifica el nombre de la tabla
  }
);

Pedido.belongsTo(Cliente, { foreignKey: "idClienteFK", onDelete: "CASCADE" });
Pedido.belongsTo(Domiciliario, {
  foreignKey: "idDomiciliarioFK",
  onDelete: "SET NULL",
});

Pedido.associate = function (models) {
  Pedido.hasMany(models.Venta, {
    foreignKey: "idPedidoFK",
    as: "ventas",
  });
};
export default Pedido;

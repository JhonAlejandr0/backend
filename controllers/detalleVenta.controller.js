// src/controllers/detalleventa.controller.js
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Cliente from "../models/cliente.model.js";
import Pedido from "../models/pedido.model.js";
import Usuario from "../models/usuario.model.js";
import DetalleVenta from "../models/detalleVenta.model.js";
import Venta from "../models/ventas.model.js";
import Producto from "../models/productos.model.js";

class DetalleVentaController {
  // Obtener todos los detalles de venta
  static async getAllDetallesVentas(req, res) {
    try {
      const { idPedido } = req.params;
      const { documento } = req.body;

      const obtenerPedido = await Pedido.findOne({
        where: { idPedido },
      });
      if (!obtenerPedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      const obtenerCliente = await Cliente.findOne({
        where: { idCliente: obtenerPedido.dataValues.idClienteFK },
      });
      const obtenerUsuario = await Usuario.findOne({
        where: { documento },
      });

      if (!obtenerCliente || !obtenerUsuario) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      if (obtenerUsuario.documento !== obtenerCliente.documentoFK) {
        return res.status(403).json({ message: "No autorizado" });
      }
      const idVenta = await Venta.findOne({
        where: { idPedidoFK: idPedido },
      });
      const detalleVenta = await DetalleVenta.findAll({
        where: { idVentasFK: idVenta.dataValues.idVentas },
      });
      const productos = [];
      for (const detalle of detalleVenta) {
        const producto = await Producto.findOne({
          where: { idProductos: detalle.idProductosFK },
        });
        const { cantidad, valorUnitario } = detalle;
        const { nombreProducto } = producto;
        productos.push({ nombreProducto, cantidad, valorUnitario });
      }

      res.status(200).json([
        productos,
        {
          fechaVenta: idVenta.fechaVenta,
          valorTotal: idVenta.valorTotal,
          idDeVenta: idVenta.idVentas,
        },
      ]);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los detalles de venta" });
    }
  }
  // Obtener un detalle de venta por ID
}

export default DetalleVentaController;

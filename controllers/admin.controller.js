// src/controllers/admin.controller.js
import Admin from "../models/admin.model.js";
import DetalleVenta from "../models/detalleVenta.model.js";
import Venta from "../models/ventas.model.js";
import Usuario from "../models/usuario.model.js";
import Cliente from "../models/cliente.model.js";
import Producto from "../models/productos.model.js";
import Domiciliario from "../models/domiciliario.model.js";
import Pedido from "../models/pedido.model.js";
class AdminController {
  static async obtenerVentas(req, res) {
    try {
      console.log(req.params);
      const buscarAdmin = await Admin.findOne({
        where: { documentoFK: req.params.documento },
      });
      if (!buscarAdmin) {
        return res.status(404).json({ message: "Admin no encontrado" });
      }
      const buscarVentas = await Venta.findAll();
      if (!buscarVentas) {
        return res.status(404).json({ message: "Ventas no encontradas" });
      }
      const formatoVentas = [];
      for (const venta of buscarVentas) {
        const cliente = await Cliente.findOne({
          where: { idCliente: venta.idClienteFK },
        });
        const buscarUsuario = await Usuario.findOne({
          where: { documento: cliente.documentoFK },
        });
        formatoVentas.push({
          idVenta: venta.idVentas,
          fechaVenta: venta.fechaVenta,
          valorTotal: venta.valorTotal,
          cliente: buscarUsuario.NombreCompleto,
          estadoVenta: venta.estadoVenta,
          metodoPagoVenta: venta.metodoPagoVenta,
        });
      }
      res.status(200).json(formatoVentas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener las ventas" });
    }
  }
  static async detalleVenta(req, res) {
    try {
      const { idVenta } = req.params;
      const venta = await Venta.findOne({
        where: { idVentas: idVenta },
      });
      const detalleVenta = await DetalleVenta.findAll({
        where: { idVentasFK: idVenta },
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
      const pedido = await Pedido.findOne({
        where: { idPedido: venta.idPedidoFK },
      });

      const domiciliarios = await Domiciliario.findOne({
        where: { idDomiciliario: pedido.idDomiciliarioFK },
      });
      if (!domiciliarios) {
        return res.status(200).json([
          productos,
          {
            fechaVenta: venta.fechaVenta,
            valorTotal: venta.valorTotal,
            idDeVenta: venta.idVentas,
            domiciliario: "No asignado",
          },
        ]);
      }

      const usuarioDomi = await Usuario.findOne({
        where: { documento: domiciliarios.documentoFK },
      });

      const { contraseña, rol, token, usuario, ...formatoDomiciliario } =
        usuarioDomi.dataValues;

      res.status(200).json([
        productos,
        {
          fechaVenta: venta.fechaVenta,
          valorTotal: venta.valorTotal,
          idDeVenta: venta.idVentas,
          domiciliario: formatoDomiciliario,
        },
      ]);
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .json({ message: "Error al obtener los detalles de venta" });
    }
  }
}

export default AdminController;

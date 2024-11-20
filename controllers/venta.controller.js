import DetalleVenta from "../models/detalleVenta.model.js";
import Pedido from "../models/pedido.model.js";
import Producto from "../models/productos.model.js";
import Usuario from "../models/usuario.model.js";
import Venta from "../models/ventas.model.js";
import Cliente from "../models/cliente.model.js";
import Domiciliario from "../models/domiciliario.model.js";
class VentaController {
  static async crearVenta(req, res) {
    const { metodosPago, carrito, correo, valorTotal } = req.body;

    try {
      const usuario = await Usuario.findOne({
        where: { correo: correo },
      });
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      // Crear un nuevo pedido
      const cliente = await Cliente.findOne({
        where: { documentoFk: usuario.documento },
      });
      const nuevoPedido = await Pedido.create({
        fechaPedido: new Date(),
        estadoPedido: "Pendiente",
        idClienteFK: cliente.idCliente,
        direccion: usuario.direccion,
        pago: Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000,
      });

      // Crear una nueva venta
      const nuevaVenta = await Venta.create({
        fechaVenta: new Date(),
        metodoPagoVenta: metodosPago,
        idClienteFK: cliente.idCliente,
        estadoVenta: "Pendiente",
        idPedidoFK: nuevoPedido.idPedido,
        valorTotal: valorTotal,
      });

      // Crear detalles de la venta
      for (const producto of carrito) {
        await DetalleVenta.create({
          valorUnitario: producto.precioProducto,
          cantidad: producto.cantidad,
          idVentasFK: nuevaVenta.idVentas,
          idProductosFK: producto.idProductos,
        });

        // Actualizar la cantidad de productos en el inventario

        const productoActualizar = await Producto.getProductoById(
          producto.idProductos
        );

        productoActualizar.stockProducto -= producto.cantidad;
        productoActualizar.save();
      }

      res.status(201).json({ message: "Venta creada exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear la venta" });
    }
  }
  static async obtenerPedidos(req, res) {
    const { documento } = req.params;

    try {
      const cliente = await Cliente.findOne({
        where: { documentoFk: documento },
      });
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      const pedidos = await Venta.findAll({
        where: { idClienteFK: cliente.idCliente },
      });

      const formatoPedido = [];
      for (const pedido of pedidos) {
        const detalles = await Pedido.findOne({
          where: { idPedido: pedido.idPedidoFK },
        });

        if (detalles.dataValues.idDomiciliarioFK === null) {
          formatoPedido.push({
            idPedido: detalles.idPedido,
            fechaPedido: detalles.fechaPedido,
            estadoPedido: detalles.estadoPedido,
            direccion: detalles.direccion,
            pago: pedido.valorTotal,
            domiciliario: "No asignado",
            telefono: "No asignado",
          });
        } else {
          console.log(
            detalles.dataValues.idDomiciliarioFK,
            detalles.dataValues
          );

          const obtener = await Domiciliario.findOne({
            where: { idDomiciliario: detalles.dataValues.idDomiciliarioFK },
          });
          const datosDomiciliario = await Usuario.findOne({
            where: { documento: obtener.documentoFK },
          });
          formatoPedido.push({
            idPedido: detalles.idPedido,
            fechaPedido: detalles.fechaPedido,
            estadoPedido: detalles.estadoPedido,
            direccion: detalles.direccion,
            pago: pedido.valorTotal,
            domiciliario: datosDomiciliario.NombreCompleto,
            telefono: datosDomiciliario.telefono,
          });
        }
      }

      res.status(200).json(formatoPedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los pedido" });
    }
  }
}

export default VentaController;

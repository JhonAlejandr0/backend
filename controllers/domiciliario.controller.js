import Venta from "../models/ventas.model.js";
import Pedido from "../models/pedido.model.js";
import Domiciliario from "../models/domiciliario.model.js";
import DetalleVenta from "../models/detalleVenta.model.js";
import Producto from "../models/productos.model.js";
import { formatCurrency } from "../helpers/format.js";
import Usuario from "../models/usuario.model.js";
import Cliente from "../models/cliente.model.js";
class DomiciliarioController {
  // Obtener todos los domiciliarios
  static async obtenerDomicilios(req, res) {
    const { documento } = req.body;

    try {
      const pedidos = await Pedido.findAll({
        where: {
          estadoPedido: "Pendiente",
        },
      });
      if (pedidos.length === 0) {
        return res
          .status(404)
          .json({ message: "No hay domicilios pendientes" });
      }
      const domiciliosEnvio = [];
      const domiciliario = await Domiciliario.findOne({
        where: {
          documentoFK: documento,
        },
      });

      for (const pedido of pedidos) {
        if (
          domiciliario.domiciliosRechazados === null ||
          !domiciliario.domiciliosRechazados.includes(pedido.idPedido)
        ) {
          const venta = await Venta.findOne({
            where: { idPedidoFK: pedido.idPedido },
          });

          domiciliosEnvio.push({
            idPedido: pedido.idPedido,
            estado: pedido.estadoPedido,
            direccion: pedido.direccion,
            pago: formatCurrency(pedido.pago),
            valorTotal: formatCurrency(venta.valorTotal),
          });
        }
      }
      res.status(200).json(domiciliosEnvio);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los domicilios" });
    }
  }
  static async agregarDomicilio(req, res) {
    const { idPedido } = req.params;
    const { documento } = req.body;

    try {
      const domicilio = await Venta.findOne({
        where: {
          idPedidoFk: idPedido,
        },
      });

      if (!domicilio) {
        return res.status(404).json({ message: "Domicilio no encontrado" });
      }
      if (domicilio.dataValues.estadoVenta !== "Pendiente") {
        return res
          .status(400)
          .json({ message: "El domicilio ya fue escogido" });
      }

      const domiciliario = await Domiciliario.findOne({
        where: {
          documentoFK: documento,
        },
      });
      if (!domiciliario) {
        return res.status(404).json({ message: "Domiciliario no encontrado" });
      }
      const pedido = await Pedido.findOne({
        where: {
          idPedido,
        },
      });

      pedido.idDomiciliarioFK = domiciliario.idDomiciliario;
      pedido.estadoPedido = "En camino";
      await pedido.save();
      domicilio.estadoVenta = "En camino";
      await domicilio.save();

      res.status(200).json({ message: "Domicilio en camino" });
    } catch (error) {
      res.status(500).json({ message: "Error al agregar el domicilio" });
    }
  }
  static async domiciliosPendientes(req, res) {
    const { documento } = req.params;

    try {
      const domiciliario = await Domiciliario.findOne({
        where: {
          documentoFK: documento,
        },
      });

      if (!domiciliario) {
        return res.status(404).json({ message: "Domiciliario no encontrado" });
      }
      const pedidosPendientes = await Pedido.findAll({
        where: {
          idDomiciliarioFK: domiciliario.idDomiciliario,
          estadoPedido: "En camino",
        },
      });
      if (pedidosPendientes.length === 0) {
        return res.status(404).json({ message: "No hay pedidos pendientes" });
      }

      const formatoPedidoPendientes = [];
      for (const pedido of pedidosPendientes) {
        pedido.pago = formatCurrency(pedido.pago);

        const venta = await Venta.findOne({
          where: {
            idPedidoFK: pedido.idPedido,
          },
        });
        const cliente = await Cliente.findOne({
          where: {
            idCliente: venta.idClienteFK,
          },
        });
        const usuario = await Usuario.findOne({
          where: {
            documento: cliente.documentoFK,
          },
        });
        formatoPedidoPendientes.push({
          ...pedido.dataValues,
          valorTotal: formatCurrency(venta.valorTotal),
          nombreCliente: usuario.NombreCompleto,
          telefonoCliente: usuario.telefono,
        });
      }

      res.status(200).json(formatoPedidoPendientes);
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Error al obtener los domicilios" });
    }
  }
  static async completarDomicilio(req, res) {
    const { idPedido } = req.params;

    try {
      const pedido = await Pedido.findOne({
        where: {
          idPedido,
        },
      });
      if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }

      pedido.estadoPedido = "Completado";
      await pedido.save();
      await Venta.update(
        { estadoVenta: "Completado" },
        {
          where: {
            idClienteFK: pedido.idClienteFK,
          },
        }
      );
      res.status(200).json({ message: "Pedido completado" });
    } catch (error) {
      res.status(500).json({ message: "Error al completar el pedido" });
    }
  }
  static async cancelarDomicilio(req, res) {
    const { idPedido } = req.params;
    try {
      const pedido = await Pedido.findOne({
        where: {
          idPedido,
        },
      });
      if (pedido.estadoPedido === "Completado") {
        return res.status(400).json({ message: "El pedido ya fue completado" });
      }

      if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      pedido.estadoPedido = "Cancelado";
      await pedido.save();
      await Venta.update(
        { estadoVenta: "Cancelado" },
        {
          where: {
            idClienteFK: pedido.idClienteFK,
          },
        }
      );
      res.status(200).json({ message: "Pedido cancelado" });
    } catch (error) {
      res.status(500).json({ message: "Error al cancelar el pedido" });
    }
  }
  static async agregarDomicilioNoDeseado(req, res) {
    const { idPedido } = req.params;
    const { documento } = req.body;
    try {
      const pedido = await Pedido.findOne({
        where: {
          idPedido,
        },
      });
      if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      const domiciliario = await Domiciliario.findOne({
        where: {
          documentoFK: documento,
        },
      });
      if (domiciliario.domiciliosRechazados === null) {
        domiciliario.domiciliosRechazados = `${idPedido} `;
      } else {
        domiciliario.domiciliosRechazados += `${idPedido} `;
      }
      await domiciliario.save();
      res.status(200).json({ message: "Pedido no deseado agregado" });
    } catch (error) {
      res.status(500).json({ message: "Error al agregar el domicilio" });
    }
  }
  static async informacionPedido(req, res) {
    const { idPedido } = req.params;
    const { documento } = req.body;
    try {
      const pedido = await Pedido.findOne({
        where: {
          idPedido,
        },
      });
      if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      const domiciliario = await Domiciliario.findOne({
        where: {
          idDomiciliario: pedido.idDomiciliarioFK,
        },
      });
      if (!domiciliario) {
        return res.status(404).json({ message: "Domiciliario no encontrado" });
      }
      if (domiciliario.documentoFK !== documento) {
        return res.status(400).json({ message: "El pedido no es tuyo" });
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

        const { cantidad } = detalle;
        const { nombreProducto, foto_URL, idProductos } = producto;
        productos.push({ nombreProducto, cantidad, foto_URL, idProductos });
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
      res.status(500).json({ message: "Error al obtener la información" });
    }
  }
}

export default DomiciliarioController;

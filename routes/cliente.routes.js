import { Router } from "express";
import VentaController from "../controllers/venta.controller.js";
import DetalleVentaController from "../controllers/detalleVenta.controller.js";
const cliente = Router();

cliente.post("/compra", VentaController.crearVenta);
cliente.get("/pedidos/:documento", VentaController.obtenerPedidos);
cliente.post("/pedido/:idPedido", DetalleVentaController.getAllDetallesVentas);

export default cliente;

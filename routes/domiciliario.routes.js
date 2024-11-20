// src/routes/index.js
import { Router } from "express";
import DomiciliarioController from "../controllers/domiciliario.controller.js";

const domiciliario = Router();

domiciliario.put("/domicilios", DomiciliarioController.obtenerDomicilios); //
domiciliario.put("/agregar/:idPedido", DomiciliarioController.agregarDomicilio); //
domiciliario.get(
  "/pendientes/:documento",
  DomiciliarioController.domiciliosPendientes
); //
domiciliario.put(
  "/cancelar/:idPedido",
  DomiciliarioController.cancelarDomicilio
); //
domiciliario.put(
  "/eliminar/:idPedido",
  DomiciliarioController.agregarDomicilioNoDeseado
); //
domiciliario.put(
  "/entregar/:idPedido",
  DomiciliarioController.completarDomicilio
); //
domiciliario.put("/pedido/:idPedido", DomiciliarioController.informacionPedido); //
export default domiciliario;

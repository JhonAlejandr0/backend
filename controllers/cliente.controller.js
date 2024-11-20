// src/controllers/cliente.controller.js
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class ClienteController {
  // Obtener todos los clientes
  static async compra(req, res) {
    console.log(req.body);
  }
}

export default ClienteController;

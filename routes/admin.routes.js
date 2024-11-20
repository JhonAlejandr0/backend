// src/routes/index.js
import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";

const admin = Router();

admin.get("/ventas/:documento", AdminController.obtenerVentas); // Login
admin.get("/detalle/:idVenta", AdminController.detalleVenta); // Login

export default admin;

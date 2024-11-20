// src/routes/index.js
import { Router } from "express";
import EmpleadoController from "../controllers/empleado.controller.js";
import RegisterController from "../controllers/register.controller.js";
import LoginController from "../controllers/login.controller.js";

const router = Router();

router.get("/api/empleado", EmpleadoController.getAllEmpleados); // Obtener todos los empleados
router.get("/api/empleado/:idEmpleado", EmpleadoController.getEmpleadoById); // Obtener un empleado por ID
router.post("/api/empleado", EmpleadoController.postEmpleado); // Crear un nuevo empleado
router.put("/api/empleado/:idEmpleado", EmpleadoController.putEmpleado); // Actualizar un empleado
router.delete("/api/empleado/:idEmpleado", EmpleadoController.deleteEmpleado); // Eliminar un empleado

export default router;

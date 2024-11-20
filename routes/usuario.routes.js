import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";
import RegisterController from "../controllers/register.controller.js";
import LoginController from "../controllers/login.controller.js";

const usuario = Router();

usuario.get("", UsuarioController.getAllUsuarios); // Obtener todos los usuarios

usuario.get("/:documento", UsuarioController.getUsuarioByDocumento); // Obtener un usuario por documento
usuario.post("", UsuarioController.postUsuario); // Crear un nuevo usuario
usuario.put("/:documento", UsuarioController.putUsuario); // Actualizar un usuario
usuario.delete("/:documento", UsuarioController.deleteUsuario); // Eliminar un usuario
usuario.post("/register", RegisterController.register); // Registro
usuario.post("/login", LoginController.login); // Login
usuario.get("/verificar/:token", LoginController.verificar); // Login
usuario.post("/token/:token", UsuarioController.setPostToken); // Login
usuario.put("/token/:token", UsuarioController.putPassword); // Login

export default usuario;

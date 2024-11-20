import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Usuario from "../models/usuario.model.js";
process.loadEnvFile();

class LoginController {
  static async login(req, res) {
    try {
      const { correo, password } = req.body;

      if (!correo || !password) {
        return res.status(400).json({
          message: "Todos los campos son requeridos",
        });
      }
      const usuario = await Usuario.getByCorreo(correo);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }
      const contraseñaValida = await bcrypt.compare(
        password,
        usuario.contraseña
      );

      if (!contraseñaValida) {
        return res.status(401).json({
          message: "Contraseña incorrecta",
        });
      }

      const token = jwt.sign(
        { documento: usuario.documento },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        documento: usuario.documento,
        usuario: usuario.usuario,
        NombreCompleto: usuario.NombreCompleto,
        correo: usuario.correo,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        token: token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al loguear el usuario",
      });
    }
  }
  static async verificar(req, res) {
    const token = req.params.token;

    if (!token) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.getByDocument(decoded.documento);
      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }
      return res.status(200).json({ message: "Usuario verificado con exito" });
    } catch (error) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }
  }
}
export default LoginController;

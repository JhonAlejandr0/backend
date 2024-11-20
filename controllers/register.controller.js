import bcrypt from "bcrypt";
import Usuario from "../models/usuario.model.js";
import Cliente from "../models/cliente.model.js";
/*
{
  "NombreCompleto": "Juan Pérez",
  "correo": "juan.perez@example.es",
  "telefono": "123456789",
  "direccion": "Calle Falsa 123",
  "rol": "Cliente",
  "usuario": "juanp",
  "contraseña": "mi_contraseña_secreta"
}
*/
class RegisterController {
  static async register(req, res) {
    try {
      const {
        documento,
        NombreCompleto,
        correo,
        telefono,
        direccion,
        rol, //.
        usuario, //.
        contraseña, //.
      } = req.body;

      // Validación de entrada
      if (
        !documento ||
        !NombreCompleto ||
        !correo ||
        !telefono ||
        !direccion ||
        !rol ||
        !usuario ||
        !contraseña
      ) {
        // Verificar si los campos requeridos están vacíos
        return res.status(400).json({
          message: "Todos los campos son requeridos",
        });
      }
      const usuarioExistente = await Usuario.getByDocument(documento);
      const porCorreo = await Usuario.getByCorreo(correo);
      if (usuarioExistente || porCorreo) {
        return res.status(400).json({
          message: "El usuario ya existe",
        });
      }
      // Encriptar la contraseña antes de guardarla
      const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

      const newUser = {
        documento,
        NombreCompleto,
        correo,
        telefono,
        direccion,
        rol,
        usuario,
        contraseña: contraseñaEncriptada,
      };

      // Guardar el nuevo usuario en la base de datos
      const usuarioCreado = await Usuario.createUsuario(newUser);
      if (rol === "Cliente") {
        await Cliente.create({ documentoFK: usuarioCreado.documento });
      }
      return res.status(201).json({
        message: "Usuario registrado exitosamente",
        usuario: usuarioCreado,
      });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      return res.status(500).json({
        message:
          "Error al registrar el usuario. Por favor, intenta nuevamente más tarde.",
      });
    }
  }
}

export default RegisterController;
